from django.urls import path
from .views import (ChampionListView, 
                    BuildListFilteredView, 
                    AvisBuildCreateView, 
                    ArticleListCreateView, 
                    ArticleDetailView, 
                    toggle_build_visibility, 
                    BuildDeleteView, 
                    AvisBuildDeleteView,
                    ArticleUpdateView, 
                    ArticleDeleteView)

urlpatterns = [
    path('champions/', ChampionListView.as_view(), name='champion-list'),
    path('builds/', BuildListFilteredView.as_view(), name='build-list-filtered'),
    path('builds/<int:pk>/toggle_visibility/', toggle_build_visibility, name='build-toggle-visibility'),
    path('builds/<int:pk>/delete/', BuildDeleteView.as_view(), name='build-delete'),
    path('avis/', AvisBuildCreateView.as_view(), name='avis-create'),
    path('avis/<int:pk>/delete/', AvisBuildDeleteView.as_view(), name='avis-delete'),
    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:pk>/update/', ArticleUpdateView.as_view(), name='article-update'),
    path('articles/<int:pk>/delete/', ArticleDeleteView.as_view(), name='article-delete'),
]
