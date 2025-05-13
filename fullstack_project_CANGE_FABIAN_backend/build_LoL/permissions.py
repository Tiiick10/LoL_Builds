from rest_framework.permissions import BasePermission

class IsUtilisateur(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name__in=["user", "Redac"]).exists()

class IsRedacteur(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="Redac").exists()

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user
