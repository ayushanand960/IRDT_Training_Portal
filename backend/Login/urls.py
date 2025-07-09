from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView, VerifySecurityAnswerAPIView, ResetPasswordAPIView, GetSecurityQuestionAPIView, CustomTokenObtainPairView, UpdateUserRoleView, ListCreateUserView, CreateUserView,UpdateUserView, DeleteUserView, CoordinatorListAPIView

urlpatterns = [
    
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin-token/', CustomTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('get-security-question/', GetSecurityQuestionAPIView.as_view(), name='get-security-question'),
    path('verify-security/', VerifySecurityAnswerAPIView.as_view(), name='verify-security'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
     path('update-role/', UpdateUserRoleView.as_view(), name='update-user-role'),
     path("users/", ListCreateUserView.as_view(), name="list-create-users"),
    path("users/<int:pk>/", UpdateUserView.as_view(), name="update-user"),
    path("users/<int:pk>/", DeleteUserView.as_view(), name="delete-user"),
    path("coordinators/", CoordinatorListAPIView.as_view(), name="coordinator-list"),
]