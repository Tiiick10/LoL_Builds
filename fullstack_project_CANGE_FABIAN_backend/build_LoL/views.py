from rest_framework import generics, status, serializers, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.conf import settings
from .models import Champion, Build, AvisBuild, Article
from .serializers import (
    ChampionSerializer, BuildSerializer, AvisBuildSerializer,
    ArticleSerializer, BuildListSerializer, CustomTokenObtainPairSerializer,
    UserSerializer
)
from .permissions import IsRedacteur, IsUtilisateur, IsOwnerOrReadOnly
import re


# ------------------------------------------------------------------ #
# Cookie helpers - store JWT tokens in httpOnly cookies              #
# ------------------------------------------------------------------ #

def _access_cookie_name():
    return getattr(settings, 'AUTH_COOKIE_ACCESS', 'access')


def _refresh_cookie_name():
    return getattr(settings, 'AUTH_COOKIE_REFRESH', 'refresh')


def _cookie_secure():
    return getattr(settings, 'AUTH_COOKIE_SECURE', False)


def _cookie_httponly():
    return getattr(settings, 'AUTH_COOKIE_HTTPONLY', True)


def _cookie_samesite():
    return getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax')


def _cookie_max_age():
    return getattr(settings, 'AUTH_COOKIE_MAX_AGE', 60 * 60 * 24 * 7)


def _set_auth_cookies(response, access_token, refresh_token):
    """Set the access and refresh tokens as httpOnly cookies on the response."""
    response.set_cookie(
        _access_cookie_name(),
        access_token,
        max_age=getattr(settings, 'AUTH_COOKIE_ACCESS_MAX_AGE', 60 * 60),
        httponly=_cookie_httponly(),
        secure=_cookie_secure(),
        samesite=_cookie_samesite(),
        path='/',
    )
    response.set_cookie(
        _refresh_cookie_name(),
        refresh_token,
        max_age=_cookie_max_age(),
        httponly=_cookie_httponly(),
        secure=_cookie_secure(),
        samesite=_cookie_samesite(),
        path='/',
    )
    return response


def _clear_auth_cookies(response):
    """Delete the auth cookies from the response."""
    response.delete_cookie(_access_cookie_name(), path='/')
    response.delete_cookie(_refresh_cookie_name(), path='/')
    return response


def _user_role(user):
    """Return the role string for a user (mirrors the JWT payload)."""
    if user.is_superuser:
        return 'Admin'
    if user.groups.filter(name='Rédacteur').exists():
        return 'Redacteur'
    if user.groups.filter(name='Manager').exists():
        return 'Manager'
    return 'User'

# Create your views here.

class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"detail": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)
    role = _user_role(user)

    response = Response({
        "user_id": user.id,
        "username": user.username,
        "is_superuser": user.is_superuser,
        "role": role,
    }, status=200)

    # Store the tokens in httpOnly cookies (inaccessible to JavaScript)
    _set_auth_cookies(response, str(refresh.access_token), str(refresh))
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def cookie_token_refresh_view(request):
    """Refresh the access token from the httpOnly refresh cookie."""
    refresh_token = request.COOKIES.get(_refresh_cookie_name())
    if not refresh_token:
        return Response({"detail": "Refresh token cookie missing."}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        new_access = str(refresh.access_token)
        user = User.objects.get(id=refresh['user_id'])
        role = _user_role(user)
    except Exception:
        response = Response({"detail": "Invalid or expired refresh token."}, status=401)
        _clear_auth_cookies(response)
        return response

    response = Response({
        "access": new_access,
        "user_id": user.id,
        "username": user.username,
        "is_superuser": user.is_superuser,
        "role": role,
    }, status=200)

    # Rotate the refresh cookie too
    new_refresh = str(refresh)
    _set_auth_cookies(response, new_access, new_refresh)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    """Clear the httpOnly auth cookies."""
    response = Response({"detail": "Logged out."}, status=200)
    _clear_auth_cookies(response)
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_status_view(request):
    """Return the current auth state (used by the frontend AuthProvider on mount)."""
    from .authentication import CookieJWTAuthentication
    try:
        user, _ = CookieJWTAuthentication().authenticate(request)
    except Exception:
        user = None

    if user is not None:
        return Response({
            "isLoggedIn": True,
            "user_id": user.id,
            "username": user.username,
            "is_superuser": user.is_superuser,
            "role": _user_role(user),
        }, status=200)
    return Response({"isLoggedIn": False}, status=200)

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

class BuildDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BuildDeleteView(generics.DestroyAPIView):
    queryset = Build.objects.all()
    serializer_class = BuildSerializer
    permission_classes = [permissions.IsAuthenticated]

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

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)

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
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-date_creation')
        categorie = self.request.query_params.get('categorie')
        if categorie:
            queryset = queryset.filter(categorie=categorie)
        return queryset


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
