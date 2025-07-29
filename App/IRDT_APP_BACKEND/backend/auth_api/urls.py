from django.urls import path
from rest_framework_simplejwt.views import  TokenRefreshView
# from .views import get_user_profile, profile_view
from .views import (
    RegisterView,
    LoginView,
    GetSecurityQuestionAPIView,
    VerifySecurityAnswerAPIView,
    ResetPasswordAPIView,
    CustomTokenObtainPairView,
    AuthenticatedUserProfileView,
    GetUserProfileView,
    UploadProfilePhotoView,
    RemoveProfilePhotoView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('get-security-question/<str:ehrms_code>/', GetSecurityQuestionAPIView.as_view(), name='get-security-question'),
    path('verify-security/', VerifySecurityAnswerAPIView.as_view(), name='verify-security'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-profile/<str:ehrms_code>/', GetUserProfileView.as_view(), name='user-profile'),
    path('profile/upload-photo/', UploadProfilePhotoView.as_view(), name='upload-profile-photo'),
    path('profile/remove-photo/', RemoveProfilePhotoView.as_view(), name='remove-profile-photo'),
    path('profile/<str:ehrms_code>/', AuthenticatedUserProfileView.as_view(), name='authenticated-profile'),

]


