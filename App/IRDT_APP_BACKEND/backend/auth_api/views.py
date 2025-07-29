
import os
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, PasswordResetSerializer, UserProfileSerializer,CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser

import logging

logger = logging.getLogger(__name__)



class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "ehrms_code": user.ehrms_code,
                "full_name": user.full_name
            })
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)



class GetSecurityQuestionAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, ehrms_code):
        # ehrms_code = request.data.get("ehrms_code", "").strip()

        if not ehrms_code:
            return Response({"error": "EHRMS code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            return Response({"security_question": user.security_question}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)




class VerifySecurityAnswerAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ehrms_code = request.data.get("ehrms_code", "").strip()
        answer = request.data.get("security_answer", "").strip().lower()

        if not ehrms_code or not answer:
            return Response({"error": "ehrms_code and security_answer required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            correct_answer = user.security_answer.strip().lower()

            if correct_answer == answer:
                return Response({"success": True}, status=status.HTTP_200_OK)
            return Response({"error": "Incorrect answer"}, status=status.HTTP_403_FORBIDDEN)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        ehrms_code = serializer.validated_data['ehrms_code']
        new_password = serializer.validated_data['new_password']

        try:
            serializer.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class GetUserProfileView(APIView):
    def get(self, request, ehrms_code):
        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AuthenticatedUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ehrms_code):
        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            # serializer = UserProfileSerializer(user)
            serializer = UserProfileSerializer(user, context={'request': request})

            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UploadProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user
        
        if user.photo and os.path.isfile(user.photo.path):
            os.remove(user.photo.path)
            
        if 'photo' not in request.data:
            return Response({"error": "No photo uploaded"}, status=400)

        # uploaded_file = request.data['photo']
        # ext = uploaded_file.name.split('.')[-1]
        # uploaded_file.name = f"{user.ehrms_code}.{ext}"
        user.photo = request.data['photo']
        user.save()
        
        return Response({
            "message": "Photo uploaded successfully",
            "photo": request.build_absolute_uri(user.photo.url)
        }, status=status.HTTP_200_OK)

class RemoveProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.photo and os.path.isfile(user.photo.path):
            os.remove(user.photo.path)  # delete photo file
        user.photo = None  # reset to default
        user.save()
        return Response({
            "message": "Photo removed successfully",
            "photo": request.build_absolute_uri('/media/profile_photos/default_profile.jpg')
        }, status=status.HTTP_200_OK)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer