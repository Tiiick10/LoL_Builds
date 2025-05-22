from rest_framework.permissions import BasePermission

class IsUtilisateur(BasePermission):
    def has_permission(self, request, view):
        print("=== [PERMISSION CHECK] ===")
        print("User:", request.user)
        print("Is Authenticated:", request.user.is_authenticated)
        print("Groupes:", list(request.user.groups.values_list('name', flat=True)))
        return request.user and request.user.groups.filter(name__in=["User", "Rédacteur"]).exists()

class IsRedacteur(BasePermission):
    def has_permission(self, request, view):
        return request.user and (
            request.user.is_superuser or
            request.user.groups.filter(name="Rédacteur").exists()
        )

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user
