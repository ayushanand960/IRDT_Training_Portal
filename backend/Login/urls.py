from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserProfileView, VerifySecurityAnswerAPIView, ResetPasswordAPIView, GetSecurityQuestionAPIView, UpdateUserRoleView, ListCreateUserView, CreateUserView, CoordinatorListAPIView, UserRetrieveUpdateDeleteView, CoordinatorTrainingListView, AssignUserToTrainingView, CookieTokenObtainPairView, LogoutView, CheckAuthView, CookieTokenRefreshView, RemoveProfilePhotoView, UploadProfilePictureAPIView, AccessCodeCheckView

urlpatterns = [
    
    path('register/', RegisterView.as_view(), name='register'),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('admin-token/', CustomTokenObtainPairView.as_view(), name='admin_token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/', CookieTokenObtainPairView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('auth/check/', CheckAuthView.as_view()),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    # path('profile/upload-photo/', UploadProfilePhotoView.as_view(), name='upload-profile-photo'),  #Piyush
    # path('profile/remove-photo/', RemoveProfilePhotoView.as_view(), name='remove-profile-photo'),  #Piyush
    path('get-security-question/', GetSecurityQuestionAPIView.as_view(), name='get-security-question'),
    path('verify-security/', VerifySecurityAnswerAPIView.as_view(), name='verify-security'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('update-role/', UpdateUserRoleView.as_view(), name='update-user-role'),
    path("users/", ListCreateUserView.as_view(), name="list-create-users"),
    path('coordinators/', CoordinatorListAPIView.as_view(), name='coordinator-list'),

    # path("users/<int:pk>/", UpdateUserView.as_view(), name="update-user"),
    # path("users/<int:pk>/", DeleteUserView.as_view(), name="delete-user"),
    path("users/<str:ehrms_code>/", UserRetrieveUpdateDeleteView.as_view(), name="user-update-delete"),
    
    # path('coordinator/<str:ehrms_code>/', CoordinatorProfileView.as_view(), name='coordinator-profile'),
    path('trainings/', CoordinatorTrainingListView.as_view(), name='coordinator-trainings'),
    path('trainings/<str:code>/assign/', AssignUserToTrainingView.as_view(), name='assign-user-training'),
    path('upload-profile-picture/', UploadProfilePictureAPIView.as_view(), name='upload-profile-picture'),
    path('remove-profile-picture/', RemoveProfilePhotoView.as_view(), name='remove-profile-picture'), 
    path("check-access-code/", AccessCodeCheckView.as_view(), name="check-access-code"),

]