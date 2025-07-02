# from django.shortcuts import render
# # from django.contrib.auth.models import User
# from rest_framework import generics
# from .serializers import UserSerializer
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import User

# # Create your views here.
# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserSerializer, PasswordResetSerializer
from .models import User
import logging

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("🚀 Incoming Register Data:", request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"New user registered: {serializer.data.get('ehrms_code')}")
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        logger.warning(f"Registration failed: {serializer.errors}")
        print("Serializer Errors:", serializer.errors)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VerifySecurityAnswerAPIView(APIView):
    def post(self, request):
        ehrms_code = request.data.get("ehrms_code")
        question = request.data.get("security_question")
        answer = request.data.get("security_answer")

        try:
            user = User.objects.get(ehrms_code=ehrms_code, security_question=question)
            if user.security_answer.lower() == answer.lower():
                return Response({"success": True}, status=status.HTTP_200_OK)
            return Response({"error": "Incorrect answer."}, status=status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordAPIView(APIView):
    def post(self, request):
        ehrms_code = request.data.get("ehrms_code")
        new_password = request.data.get("new_password")

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            validate_password(new_password, user)
            user.password = make_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        except   User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)