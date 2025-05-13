from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Champion, Build, AvisBuild, Article
from .serializers import ChampionSerializer, BuildSerializer, AvisBuildSerializer, ArticleSerializer

# Create your views here.

@api_view(['PATCH'])
def toggle_build_visibility(request, pk):
    try:
        build = Build.objects.get(pk=pk)
    except Build.DoesNotExist:
        return Response({"error": "Build not found"}, status=404)

    build.is_public = not build.is_public
    build.save()
    return Response({"id": build.id, "is_public": build.is_public}, status=200)

class ChampionListView(generics.ListAPIView):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

class BuildListCreateView(generics.ListCreateAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer

class BuildDeleteView(generics.DestroyAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer

class BuildPagination(PageNumberPagination):
    page_size = 25

class BuildListFilteredView(generics.ListAPIView):
    queryset = Build.objects.filter(is_public=True)
    serializer_class = BuildSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['role', 'champion__name']
    ordering_fields = ['created_at']
    pagination_class = BuildPagination

class AvisBuildCreateView(generics.CreateAPIView):
    queryset = AvisBuild.objects.all()
    serializer_class = AvisBuildSerializer


class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-date_creation')
    serializer_class = ArticleSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleUpdateView(generics.UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class ArticleDeleteView(generics.DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class AvisBuildDeleteView(generics.DestroyAPIView):
    queryset = AvisBuild.objects.all()
    serializer_class = AvisBuildSerializer