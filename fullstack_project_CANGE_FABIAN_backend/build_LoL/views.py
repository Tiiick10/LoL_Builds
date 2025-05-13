from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from .models import Champion, Build, AvisBuild, Article
from .serializers import ChampionSerializer, BuildSerializer, AvisBuildSerializer, ArticleSerializer
from .permissions import IsRedacteur, IsUtilisateur, IsOwnerOrReadOnly

# Create your views here.

# Toggle visibility of a build
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

# User registration
@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'All fields are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=201)

# Avis delete by index inside a build
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_avis_by_index(request, build_id, avis_index):
    try:
        build = Build.objects.get(pk=build_id)
    except Build.DoesNotExist:
        return Response({"error": "Build not found"}, status=404)

    avis_list = list(build.avis.all())
    if avis_index < 0 or avis_index >= len(avis_list):
        return Response({"error": "Avis index out of range"}, status=400)

    avis_to_delete = avis_list[avis_index]
    avis_to_delete.delete()
    return Response({"message": f"Avis #{avis_index + 1} deleted from build {build.name}."})

# 5 last public builds (HomePage)
@api_view(['GET'])
def latest_public_builds(request):
    builds = Build.objects.filter(is_public=True).order_by('-created_at')[:5]
    serializer = BuildSerializer(builds, many=True)
    return Response(serializer.data)

# 5 last articles despite the role 
@api_view(['GET'])
def latest_articles(request):
    articles = Article.objects.order_by('-date_creation')[:5]
    serializer = ArticleSerializer(articles, many=True)
    return Response(serializer.data)

# Champion list
class ChampionListView(generics.ListAPIView):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

# Build create & list (restricted to Utilisateur or Redacteur)
class BuildListCreateView(generics.ListCreateAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur]

# Build delete (only if user is author)
class BuildDeleteView(generics.DestroyAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur, IsOwnerOrReadOnly]

# Build list (public only, with pagination and filters)
class BuildPagination(PageNumberPagination):
    page_size = 25

class BuildListFilteredView(generics.ListAPIView):
    queryset = Build.objects.filter(is_public=True)
    serializer_class = BuildSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['role', 'champion__name']
    ordering_fields = ['created_at']
    pagination_class = BuildPagination

# Avis (comment) create (Utilisateur or Redacteur)
class AvisBuildCreateView(generics.CreateAPIView):
    queryset = AvisBuild.objects.all()
    serializer_class = AvisBuildSerializer
    permission_classes = [IsAuthenticated, IsUtilisateur]


# Article create & list (Redacteur only)
class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-date_creation')
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]

# Article detail view
class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

# Article update (Redacteur only)
class ArticleUpdateView(generics.UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]

# Article delete (Redacteur only)
class ArticleDeleteView(generics.DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsRedacteur]
