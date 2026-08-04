"""
Custom JWT authentication that reads the token from an httpOnly cookie
as well as from the standard Authorization header.

This lets the frontend store the JWT in an httpOnly cookie (inaccessible
to JavaScript) while still allowing API clients that use the Authorization
header (e.g. admin, scripts) to authenticate.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

# Cookie name used to store the access token (must match settings.AUTH_COOKIE_ACCESS)
AUTH_COOKIE = "access"


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        """
        First try the Authorization header (standard SimpleJWT behavior),
        then fall back to the httpOnly cookie.
        """
        header = self.get_header(request)
        if header is not None:
            raw_token = self.get_raw_token(header)
        else:
            raw_token = request.COOKIES.get(AUTH_COOKIE)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken:
            raise AuthenticationFailed("Invalid or expired token.")

        return self.get_user(validated_token), validated_token

