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
