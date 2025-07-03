from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView, VerifySecurityAnswerAPIView, ResetPasswordAPIView, GetSecurityQuestionAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('get-security-question/', GetSecurityQuestionAPIView.as_view(), name='get-security-question'),
    path('verify-security/', VerifySecurityAnswerAPIView.as_view(), name='verify-security'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
]
