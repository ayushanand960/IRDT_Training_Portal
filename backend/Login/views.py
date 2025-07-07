from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny , IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, PasswordResetSerializer, CustomTokenObtainPairSerializer,UserRoleUpdateSerializer ,UserListSerializer
from .models import User
import logging

logger = logging.getLogger(__name__)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Incoming Register Data:", request.data)
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
        ehrms_code = request.data.get("ehrms_code", "").strip()
        answer = request.data.get("security_answer", "").strip().lower()

        if not ehrms_code or not answer:
            return Response({"error": "ehrms_code and security_answer are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)

            # Compare answer (case-insensitive, trimmed)
            if user.security_answer.strip().lower() == answer:
                logger.info(f"Security answer verified for {ehrms_code}")
                return Response({"success": True}, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Incorrect security answer for {ehrms_code}")
                return Response({"error": "Verification failed."}, status=status.HTTP_403_FORBIDDEN)

        except User.DoesNotExist:
            logger.error(f"🔍 User not found for ehrms_code: {ehrms_code}")
            return Response({"error": "Verification failed."}, status=status.HTTP_403_FORBIDDEN)

class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  # for debugging
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        ehrms_code = serializer.validated_data['ehrms_code']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            user.set_password(new_password)  # recommended over make_password
            user.save()
            return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        


class GetSecurityQuestionAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ehrms_code = request.data.get("ehrms_code", "").strip()

        if not ehrms_code:
            return Response({"error": "EHRMS Code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            return Response({"security_question": user.security_question}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            logger.warning(f"User not found for EHRMS code: {ehrms_code}")
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


#....................................................

class UpdateUserRoleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        ehrms_code = request.data.get("ehrms_code")
        is_coordinator = request.data.get("is_coordinator")
        
        if isinstance(is_coordinator, str):  # convert string to boolean
            is_coordinator = is_coordinator.lower() == 'true'

        print("Received role update:", ehrms_code, is_coordinator) 

        if ehrms_code is None or is_coordinator is None:
            return Response({"error": "ehrms_code and is_coordinator are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            user.is_coordinator = is_coordinator
            user.save()
            return Response({"message": "User role updated successfully."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class ListUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetUserRoleView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, ehrms_code):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(ehrms_code=ehrms_code)
            return Response({
                "ehrms_code": user.ehrms_code,
                "is_superuser": user.is_superuser,
                "is_coordinator": user.is_coordinator
            },  status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
