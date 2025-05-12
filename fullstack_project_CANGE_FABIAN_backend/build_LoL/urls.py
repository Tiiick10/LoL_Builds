from django.urls import path
from .views import ChampionListView, BuildListCreateView, AvisBuildCreateView, ArticleListCreateView, ArticleDetailView

urlpatterns = [
    path('champions/', ChampionListView.as_view(), name='champion-list'),
    path('builds/', BuildListCreateView.as_view(), name='build-list-create'),
    path('avis/', AvisBuildCreateView.as_view(), name='avis-create'),
    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
]
