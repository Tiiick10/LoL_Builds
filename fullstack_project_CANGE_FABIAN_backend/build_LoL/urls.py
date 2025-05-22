from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    # Champion
    ChampionListView,
    get_champion_by_name,

    # Builds
    BuildListFilteredView,
    BuildListCreateView,
    BuildListPublicView,
    BuildDetailView,
    BuildDeleteView,
    toggle_build_visibility,
    latest_public_builds,

    # Avis
    AvisBuildCreateView,
    delete_avis_by_index,

    # Articles
    ArticleListCreateView,
    ArticleDetailView,
    ArticleUpdateView,
    ArticleDeleteView,
    PublicArticleListView,
    latest_articles,

    # Auth
    register_user,

    # Token Expiration
    custom_login_view,
    CustomTokenObtainPairView,

    # User
    UserDetailView,
)

urlpatterns = [
    
    # Champion

    path('champions/', ChampionListView.as_view(), name='champion-list'),
    path("champions/", get_champion_by_name),

    # Builds

    path('builds/', BuildListFilteredView.as_view(), name='build-list-filtered'),
    path('builds/create/', BuildListCreateView.as_view(), name='build-create'),
    path('builds/public/', BuildListPublicView.as_view(), name='build-list-public'),
    path('builds/<int:pk>/', BuildDetailView.as_view(), name='build-detail'),
    path('builds/<int:pk>/delete/', BuildDeleteView.as_view(), name='build-delete'),
    path('builds/<int:pk>/toggle_visibility/', toggle_build_visibility, name='build-toggle-visibility'),
    path('builds/latest/', latest_public_builds, name='latest-public-builds'),
    path('builds/<int:build_id>/avis/', AvisBuildCreateView.as_view(), name='avis-create'),

    # Avis

    path('avis/', AvisBuildCreateView.as_view(), name='avis-create'),
    path('builds/<int:build_id>/avis/<int:avis_index>/delete/', delete_avis_by_index, name='avis-delete-by-index'),

    # Articles

    path('articles/', ArticleListCreateView.as_view(), name='article-list-create'),
    path('articles/<int:pk>/', ArticleDetailView.as_view(), name='article-detail'),
    path('articles/<int:pk>/update/', ArticleUpdateView.as_view(), name='article-update'),
    path('articles/<int:pk>/delete/', ArticleDeleteView.as_view(), name='article-delete'),
    path('articles/public/', PublicArticleListView.as_view(), name='article-list-public'),
    path('articles/latest/', latest_articles, name='latest-articles'),

    # Auth

    path('register/', register_user, name='register'),

    # Token / Toekn Expiration

    path('custom-login/', custom_login_view, name='custom-login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("users/<int:id>/", UserDetailView.as_view(), name="user-detail"),


]
