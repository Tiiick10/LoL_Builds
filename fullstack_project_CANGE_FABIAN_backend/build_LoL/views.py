from rest_framework import generics, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q
from .models import Champion, Build, AvisBuild, Article
from .serializers import (
    ChampionSerializer, BuildSerializer, AvisBuildSerializer,
    ArticleSerializer, BuildListSerializer
)
from .permissions import IsRedacteur, IsUtilisateur, IsOwnerOrReadOnly
from datetime import timedelta
import re

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

# ------------------------- #
# Champion by name in Build #
# ------------------------- #

@api_view(['GET'])
def get_champion_by_name(request):
    name = request.GET.get('name')
    if not name:
        return Response({"error": "Name parameter is required."}, status=400)

    champs = Champion.objects.filter(name__iexact=name)
    serializer = ChampionSerializer(champs, many=True)
    return Response(serializer.data)

# ---------- #
# BUILD CRUD #
# ---------- #

class ChampionListView(generics.ListAPIView):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

def normalize_champion_name(name):
    return re.sub(r"[^a-zA-Z0-9]", "", name).lower()

class BuildListCreateView(generics.ListCreateAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        champion_name = self.request.data.get("champion_name")
        if not champion_name:
            raise serializers.ValidationError({"champion": "Ce champ est requis."})

        try:
            champion = Champion.objects.get(name__iexact=champion_name)
        except Champion.DoesNotExist:
            raise serializers.ValidationError({"champion": f"Champion '{champion_name}' introuvable."})

        # Additional validation for primary and secondary paths

        serializer.save(
            author=self.request.user,
            champion=champion,
            primary_path=self.request.data.get("primary_path"),
            secondary_path=self.request.data.get("secondary_path")
            )   

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
    serializer_class = BuildListSerializer
    permission_classes = [AllowAny]
    pagination_class = BuildPagination

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        queryset = Build.objects.filter(is_public=True)

        # Filters

        role = self.request.query_params.get('role')
        champion = self.request.query_params.get('champion__name')
        ordering = self.request.query_params.get('ordering', '-created_at')

        if role:
            queryset = queryset.filter(role=role)
        if champion:
            queryset = queryset.filter(champion__name__icontains=champion)

        # Psoitive/Negative comments

        queryset = queryset.annotate(
            positive_comments=Count('avis', filter=Q(avis__positif=True, avis__banned=False)),
            negative_comments=Count('avis', filter=Q(avis__positif=False, avis__banned=False)),
        )

        # Dynamically ordering

        if ordering == 'most_liked':
            queryset = queryset.order_by('-positive_comments')
        elif ordering == 'created_at':
            queryset = queryset.order_by('-created_at')
        elif ordering == '-created_at':
            queryset = queryset.order_by('created_at')
        else:
            queryset = queryset.order_by('-created_at')  # Default value

        return queryset

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


class AvisBuildCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, build_id):
        try:
            build = Build.objects.get(id=build_id)
        except Build.DoesNotExist:
            return Response({'error': 'Build not found.'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['author'] = request.user.id
        data['build'] = build.id

        serializer = AvisBuildSerializer(data=data)
        if serializer.is_valid():
            AvisBuild.objects.create(
                build=build,
                author=request.user,
                positif=serializer.validated_data['positif'],
                commentaire=serializer.validated_data['commentaire']
            )
            return Response({'message': 'Avis posted.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
