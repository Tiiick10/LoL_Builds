from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Champion, Build, AvisBuild, Article
from .serializers import (
    ChampionSerializer, BuildSerializer, AvisBuildSerializer,
    ArticleSerializer, BuildListSerializer
)
from .permissions import IsRedacteur, IsUtilisateur, IsOwnerOrReadOnly
from datetime import timedelta

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"detail": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)

    if user.is_superuser:
        refresh.set_exp(lifetime=timedelta(hours=6))  # 6 heures pour admin
    else:
        refresh.set_exp(lifetime=timedelta(hours=1))  # 1 heure pour les autres

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user_id": user.id,
        "username": user.username,
        "is_superuser": user.is_superuser,
    })

# ---- #
# AUTH #
# ---- #

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    password2 = request.data.get('password2')

    if not all([username, email, password, password2]):
        return Response({'error': 'All fields are required.'}, status=400)
    if password != password2:
        return Response({'error': 'Passwords do not match.'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=400)

    User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully.'}, status=201)

# ---------- #
# BUILD CRUD #
# ---------- #

class ChampionListView(generics.ListAPIView):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

class BuildListCreateView(generics.ListCreateAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur]

    def get_serializer_context(self):
        return {'request': self.request}

class BuildDetailView(RetrieveAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class BuildDeleteView(generics.DestroyAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur, IsOwnerOrReadOnly]

# --------------------------- #
# BUILD PUBLIC LIST & FILTERS #
# --------------------------- #

class BuildPagination(PageNumberPagination):
    page_size = 25

class BuildListPublicView(generics.ListAPIView):
    queryset = Build.objects.filter(is_public=True)
    serializer_class = BuildListSerializer
    permission_classes = [AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}

class BuildListFilteredView(generics.ListAPIView):
    serializer_class = BuildSerializer
    permission_classes = [AllowAny]
    pagination_class = BuildPagination

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Build.objects.filter(is_public=True)
        role = self.request.query_params.get('role')
        champion = self.request.query_params.get('champion__name')
        ordering = self.request.query_params.get('ordering', 'created_at')
        if role:
            queryset = queryset.filter(role=role)
        if champion:
            queryset = queryset.filter(champion__name__icontains=champion)
        return queryset.order_by(ordering)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_build_visibility(request, pk):
    try:
        build = Build.objects.get(pk=pk)
    except Build.DoesNotExist:
        return Response({"error": "Build not found"}, status=404)
    build.is_public = not build.is_public
    build.save()
    return Response({"id": build.id, "is_public": build.is_public}, status=200)

# ----------- #
# VOTE SYSTEM #
# ----------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_build(request, pk):
    build = Build.objects.get(pk=pk)
    avis = AvisBuild.objects.filter(build=build, author=request.user).first()
    if avis:
        if avis.positif:
            avis.delete()
        else:
            avis.positif = True
            avis.save()
    else:
        AvisBuild.objects.create(build=build, author=request.user, positif=True)
    return Response({
        "likes": build.avis.filter(positif=True).count(),
        "dislikes": build.avis.filter(positif=False).count(),
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dislike_build(request, pk):
    build = Build.objects.get(pk=pk)
    avis = AvisBuild.objects.filter(build=build, author=request.user).first()
    if avis:
        if not avis.positif:
            avis.delete()
        else:
            avis.positif = False
            avis.save()
    else:
        AvisBuild.objects.create(build=build, author=request.user, positif=False)
    return Response({
        "likes": build.avis.filter(positif=True).count(),
        "dislikes": build.avis.filter(positif=False).count(),
    })

# ---- #
# AVIS #
# ---- #

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_avis_by_index(request, build_id, avis_index):
    try:
        build = Build.objects.get(pk=build_id)
    except Build.DoesNotExist:
        return Response({"error": "Build not found"}, status=404)
    avis_list = list(build.avis.all())
    if 0 <= avis_index < len(avis_list):
        avis_list[avis_index].delete()
        return Response({"message": f"Avis #{avis_index + 1} deleted."})
    return Response({"error": "Index out of range"}, status=400)

class AvisBuildCreateView(generics.CreateAPIView):
    queryset = AvisBuild.objects.all()
    serializer_class = AvisBuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur]

# ------------ #
# ARTICLE CRUD #
# ------------ #

class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-date_creation')
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleUpdateView(generics.UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]

class ArticleDeleteView(generics.DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]

class PublicArticleListView(generics.ListAPIView):
    queryset = Article.objects.all().order_by('-date_creation')
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

# ------------------ #
# HOMEPAGE SHORTCUTS #
# ------------------ #

@api_view(['GET'])
def latest_public_builds(request):
    builds = Build.objects.filter(is_public=True).order_by('-created_at')[:5]
    serializer = BuildSerializer(builds, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def latest_articles(request):
    articles = Article.objects.order_by('-date_creation')[:5]
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data)
