from rest_framework_simplejwt.authentication import JWTAuthentication

# class CookieJWTAuthentication(JWTAuthentication):
#     def authenticate(self, request):
#         raw_token = request.COOKIES.get("access")
#         if raw_token is None:
#             return None  # No access token cookie found

#         validated_token = self.get_validated_token(raw_token)
#         return self.get_user(validated_token), validated_token

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get("access")
        if raw_token is None:
            print("⚠️ No access token in cookie")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except Exception as e:
            print("❌ Token validation error:", e)
            return None
