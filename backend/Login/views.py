from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
# from rest_framework_simplejwt.authentication import JWTAuthentication
from .authentication import CookieJWTAuthentication 
# from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .serializers import UserSerializer, PasswordResetSerializer, CustomTokenObtainPairSerializer, UserListSerializer, UserRoleUpdateSerializer, EditUserSerializer
from .models import User
import logging

#harshit import for training
from Training.models import TrainingProgram  # adjust if model is elsewhere
from Training.serializers import TrainingProgramSerializer  # create if not exists

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
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_superuser:
            role = "admin"
        elif user.is_coordinator:
            role = "coordinator"
        else:
            role = "trainee"

        serializer = UserSerializer(user)
        return Response({
            **serializer.data,
            "role": role,
            "is_superuser": user.is_superuser,
            "is_coordinator": user.is_coordinator,
        }, status=status.HTTP_200_OK)



# class UserProfileView(APIView):
#     authentication_classes = [CookieJWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         # ✅ Determine user role
#         if user.is_superuser:
#             role = "admin"
#         elif user.is_coordinator:
#             role = "coordinator"
#         else:
#             role = "trainee"

#         # ✅ Serialize basic user data
#         serializer = UserSerializer(user)

#         # ✅ Return structured response
#         return Response({
#             "user": serializer.data,
#             "ehrms_code": user.ehrms_code,
#             "role": role,
#         }, status=status.HTTP_200_OK)



class VerifySecurityAnswerAPIView(APIView):
    permission_classes = [AllowAny]  #Piyush
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

@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ehrms_code = request.data.get("ehrms_code")
        password = request.data.get("password")
        user = authenticate(request, ehrms_code=ehrms_code, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            "message": "Login successful",
            "is_superuser": user.is_superuser,
            "is_coordinator": getattr(user, 'is_coordinator', False)
        }, status=status.HTTP_200_OK)

        # 🔐 Set tokens as HttpOnly cookies
        response.set_cookie(
            key='access',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=300,  # 5 min
            path='/'
        )
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400,  # 1 day
            path='/'
        )

        return response



@method_decorator(csrf_exempt, name='dispatch')
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            # 🔴 Refresh token missing — clear cookies
            response = Response({"error": "No refresh token found. Session expired."}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            return response

        try:
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)

            response = Response({
                "access": access_token
            }, status=status.HTTP_200_OK)

            # 🔐 Set new access token
            response.set_cookie(
                key="access",
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                max_age=300  # 5 minutes
            )

            return response

        except Exception:
            # 🔴 Token invalid/expired — clear cookies
            response = Response({"error": "Invalid or expired refresh token. Please login again."}, status=status.HTTP_403_FORBIDDEN)
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=200)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response


class CheckAuthView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"authenticated": True}, status=200)



# Pawan addition for admin manage User


# Create a new user
class CreateUserView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = EditUserSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'ehrms_code'  # ✅ REQUIRED so DRF uses ehrms_code instead of pk

    def put(self, request, ehrms_code):
        user = get_object_or_404(User, ehrms_code=ehrms_code)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, ehrms_code):
        user = get_object_or_404(User, ehrms_code=ehrms_code)
        user.delete()
        return Response({"message": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
    


class UpdateUserRoleView(APIView):
    authentication_classes = [CookieJWTAuthentication]
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


    

class ListCreateUserView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not (request.user.is_superuser or request.user.is_coordinator):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class GetUserRoleView(APIView):

    authentication_classes = [CookieJWTAuthentication]
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


class CoordinatorListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        coordinators = User.objects.filter(is_coordinator=True)
        data = [
            {
                "ehrms_code": u.ehrms_code,
                "full_name": f"{u.first_name} {u.middle_name or ''} {u.last_name}".strip()
            }
            for u in coordinators
        ]
        return Response(data)



# Harshit Initial Set Up for coordinator dashboard

# class CoordinatorProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, ehrms_code):
#         if not request.user.is_superuser and request.user.ehrms_code != ehrms_code:
#             return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

#         try:
#             user = User.objects.get(ehrms_code=ehrms_code, is_coordinator=True)
#             data = {
#                 "ehrms_code": user.ehrms_code,
#                 "name": f"{user.first_name} {user.middle_name or ''} {user.last_name}".strip(),
#                 "email": user.email,
#                 "institute": getattr(user, "institute", None),
#             }
#             return Response(data, status=status.HTTP_200_OK)
#         except User.DoesNotExist:
#             return Response({"error": "Coordinator not found"}, status=status.HTTP_404_NOT_FOUND)


class CoordinatorTrainingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ehrms_code = request.GET.get("coordinator")
        if not ehrms_code:
            return Response({"error": "Missing coordinator EHRMS code"}, status=400)

        try:
            # ✅ Use 'faculty' since it stores the ehrms_code
            trainings = TrainingProgram.objects.filter(faculty=ehrms_code)
            serializer = TrainingProgramSerializer(trainings, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            from traceback import format_exc
            print("❌ Error in CoordinatorTrainingListView:", format_exc())
            return Response({"error": str(e)}, status=500)


class AssignUserToTrainingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, training_id):
        user_id = request.data.get("user_id")
        coordinator_code = request.data.get("coordinator_id")

        if not user_id or not coordinator_code:
            return Response({"error": "Missing user_id or coordinator_id"}, status=400)

        try:
            training = TrainingProgram.objects.get(id=training_id, coordinator__ehrms_code=coordinator_code)
            user = User.objects.get(id=user_id)
            training.participants.add(user)
            return Response({"message": "User successfully nominated!"}, status=200)
        except Training.DoesNotExist:
            return Response({"error": "Training not found or not authorized"}, status=404)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)