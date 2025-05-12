from django.shortcuts import render
from rest_framework import generics
from .models import Champion, Build, AvisBuild, Article
from .serializers import ChampionSerializer, BuildSerializer, AvisBuildSerializer, ArticleSerializer

# Create your views here.

class ChampionListView(generics.ListAPIView):
    queryset = Champion.objects.all()
    serializer_class = ChampionSerializer

class BuildListCreateView(generics.ListCreateAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer

class AvisBuildCreateView(generics.CreateAPIView):
    queryset = AvisBuild.objects.all()
    serializer_class = AvisBuildSerializer


class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by('-date_creation')
    serializer_class = ArticleSerializer


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
