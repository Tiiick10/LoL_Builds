from django.urls import path
from .views import (
    ChampionListView,
    BuildListFilteredView,
    BuildListCreateView,
    BuildDeleteView,
    BuildDetailView,
    toggle_build_visibility,
    AvisBuildCreateView,
    delete_avis_by_index,
    ArticleListCreateView,
    ArticleDetailView,
    ArticleUpdateView,
    ArticleDeleteView,
    register_user,
    latest_public_builds,
    latest_articles,
    BuildListPublicView, 
    PublicArticleListView
)

urlpatterns = [

    path('champions/', ChampionListView.as_view(), name='champion-list'),
    path('builds/', BuildListFilteredView.as_view(), name='build-list-filtered'),
    path('builds/create/', BuildListCreateView.as_view(), name='build-create'),
    path('builds/latest/', latest_public_builds, name='latest-public-builds'),
    path('builds/public/', BuildListPublicView.as_view(), name='build-list-public'),
    path('builds/<int:pk>/', BuildDetailView.as_view(), name='build-detail'),
    path('builds/<int:pk>/delete/', BuildDeleteView.as_view(), name='build-delete'),
    path('builds/<int:pk>/toggle_visibility/', toggle_build_visibility, name='build-toggle-visibility'),
    path('builds/<int:build_id>/avis/<int:avis_index>/delete/', delete_avis_by_index, name='avis-delete-by-index'),
    path('avis/', AvisBuildCreateView.as_view(), name='avis-create'),
    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/latest/', latest_articles, name='latest-articles'),
    path('articles/public/', PublicArticleListView.as_view(), name='article-list-public'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:pk>/update/', ArticleUpdateView.as_view(), name='article-update'),
    path('articles/<int:pk>/delete/', ArticleDeleteView.as_view(), name='article-delete'),
    path('auth/register/', register_user, name='register'),
]
