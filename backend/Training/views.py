from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, throttling
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import SessionAuthentication
# from rest_framework_simplejwt.authentication import JWTAuthentication
from Login.authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated  # Optional, based on your auth setup
from datetime import date
from Login.models import User
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.core.exceptions import ValidationError

from .models import TrainingProgram
from .serializers import TrainingProgramSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from Training.models import Nomination
from Enrollment.models import Enrollment
from rest_framework import serializers
from Login.serializers import UserSerializer
import pandas as pd
import logging

logger = logging.getLogger(__name__)


# ✅ List & Create Trainings
class TrainingProgramListCreateAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [throttling.UserRateThrottle]

    def get(self, request):
        trainings = TrainingProgram.objects.all().order_by('-start_date')
        serializer = TrainingProgramSerializer(trainings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = TrainingProgramSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Training created: {serializer.data.get('code')}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.warning(f"Training creation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Retrieve, Update, Delete Single Training
class TrainingProgramRetrieveUpdateDeleteAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [throttling.UserRateThrottle]

    def get_object(self, code):
        return get_object_or_404(TrainingProgram, pk=code)

    def get(self, request, code):
        training = self.get_object(code)
        serializer = TrainingProgramSerializer(training)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, code):
        training = self.get_object(code)
        serializer = TrainingProgramSerializer(training, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Training updated: {training.code}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.warning(f"Training update failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, code):
        training = self.get_object(code)
        training.delete()
        logger.info(f"Training deleted: {training.code}")
        return Response({"message": "Training deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# ✅ Upload Excel for Bulk Training Upload (Admin Only)
class TrainingUploadExcelAPIView(APIView):
    parser_classes = [MultiPartParser]
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [throttling.UserRateThrottle]

    def post(self, request):
        user = request.user
        if not user.is_staff:
            logger.warning(f"Unauthorized upload attempt by {user}")
            return Response({"error": "Only admin users can upload training data."}, status=status.HTTP_403_FORBIDDEN)

        excel_file = request.FILES.get('file')
        if not excel_file:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            df = pd.read_excel(excel_file)

            required_columns = ['code', 'name', 'start_date', 'end_date']
            for col in required_columns:
                if col not in df.columns:
                    return Response({"error": f"Missing required column: {col}"}, status=400)

            created, updated, skipped = 0, 0, 0
            for _, row in df.iterrows():
                try:
                    training_data = {
                        'code': row.get('code'),
                        'name': row.get('name'),
                        'target_group': row.get('target_group'),
                        'venue': row.get('venue'),
                        'mode': row.get('mode'),
                        'training_type': row.get('training_type'),
                        'start_date': row.get('start_date'),
                        'end_date': row.get('end_date'),
                        'faculty': row.get('faculty'),
                        'number_of_participants': row.get('number_of_participants'),
                        'remark': row.get('remark'),
                        'status': row.get('status'),
                    }

                    obj, created_flag = TrainingProgram.objects.update_or_create(
                        code=training_data['code'], defaults=training_data
                    )
                    if created_flag:
                        created += 1
                    else:
                        updated += 1

                except Exception as e:
                    logger.warning(f"Skipping row due to error: {str(e)}")
                    skipped += 1
                    continue

            return Response({
                "message": "Excel processed successfully.",
                "created": created,
                "updated": updated,
                "skipped": skipped
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Excel processing failed: {str(e)}")

            return Response({"error": f"Failed to process file: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class DashboardMetricsAPIView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ Use this if your frontend passes JWT tokens

    def get(self, request):
        today = date.today()

        total_users = User.objects.count()
        total_trainings = TrainingProgram.objects.count()
        conducted_trainings = TrainingProgram.objects.filter(end_date__lt=today).count()

        return Response({
            "total_users": total_users,
            "total_trainings": total_trainings,
            "conducted_trainings": conducted_trainings
        })
        return Response({"error": f"Failed to process file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework import generics
from .models import Nomination
from .serializers import NominationSerializer

class NominationCreateAPIView(generics.CreateAPIView):
    queryset = Nomination.objects.all()
    serializer_class = NominationSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

User = get_user_model()

class CoordinatorTrainingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        coordinator = request.user
        trainings = TrainingProgram.objects.filter(coordinator=coordinator)

        data = []
        for training in trainings:
            nominations = Nomination.objects.filter(training=training)
            trainees = [{
                "ehrms_code": nom.trainee.ehrms_code,
                "name": nom.trainee.name
            } for nom in nominations]

            data.append({
                "training_title": training.name,
                "venue": training.venue,
                "dates": f"{training.start_date} to {training.end_date}",
                "trainee_count": nominations.count(),
                "trainees": trainees
            })

        return Response(data)


class EnrolledTraineesByTrainingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found or not authorized."}, status=status.HTTP_403_FORBIDDEN)

        enrollments = Enrollment.objects.filter(training=training).select_related('trainee')
        trainees = [e.trainee for e in enrollments]
        serializer = UserSerializer(trainees, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BulkNominationSerializer(serializers.Serializer):
    training_code = serializers.CharField()
    trainee_ehrms_codes = serializers.ListField(child=serializers.CharField())

class BulkNominationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BulkNominationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        training_code = serializer.validated_data['training_code']
        ehrms_codes = serializer.validated_data['trainee_ehrms_codes']

        try:
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Not authorized or training not found."}, status=status.HTTP_403_FORBIDDEN)

        created = []
        skipped = []
        for ehrms_code in ehrms_codes:
            try:
                trainee = User.objects.get(ehrms_code=ehrms_code)
                nomination, created_flag = Nomination.objects.get_or_create(
                    training=training,
                    trainee=trainee,
                    defaults={"coordinator": request.user, "nominated_by": request.user}
                )
                from Enrollment.models import Enrollment
                enrollment, enrollment_created = Enrollment.objects.get_or_create(
                    trainee=trainee,
                    training=training,
                    defaults={"status": "nominated"}
                )
                if not enrollment_created and enrollment.status != 'nominated':
                    enrollment.status = 'nominated'
                    enrollment.save()
                if created_flag:
                    created.append(ehrms_code)
                else:
                    skipped.append(ehrms_code)
            except User.DoesNotExist:
                continue

        return Response({
            "nominated": created,
            "message": f"{len(created)} trainee(s) nominated."
        }, status=status.HTTP_200_OK)

class NominatedTraineesByTrainingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found or not authorized."}, status=403)

        # nominations = Nomination.objects.filter(training=training).select_related('trainee')
        enrollments = Enrollment.objects.filter(training=training, status='nominated').select_related('trainee')
        trainees = [e.trainee for e in enrollments]
        serializer = UserSerializer(trainees, many=True)
        return Response(serializer.data)


class RemoveNominationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, training_code, ehrms_code):
        print(f"➡️ Incoming DELETE request for training_code={training_code}, ehrms_code={ehrms_code}")

        # Step 1: Fetch training safely
        training = TrainingProgram.objects.filter(code=training_code).first()
        if not training:
            return Response({"error": "Training not found."}, status=status.HTTP_404_NOT_FOUND)

        # Step 2: Validate coordinator permission
        if request.user != training.faculty and not request.user.is_superuser:
            return Response({"error": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

        # Step 3: Fetch trainee
        trainee = User.objects.filter(ehrms_code=ehrms_code).first()
        if not trainee:
            return Response({"error": "Trainee not found."}, status=status.HTTP_404_NOT_FOUND)

        # Step 4: Delete Nomination
        Nomination.objects.filter(training=training, trainee=trainee).delete()

        # Step 5: Update Enrollment status to 'applied' if it was 'nominated'
        enrollment = Enrollment.objects.filter(training=training, trainee=trainee).first()
        if enrollment and enrollment.status == "nominated":
            enrollment.status = "applied"
            enrollment.save()

        return Response({"message": "Nomination removed and enrollment updated."}, status=status.HTTP_204_NO_CONTENT)

from Certificate.models import Certificate

class AssignedTrainingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        assigned_trainings = TrainingProgram.objects.filter(registered_users=user)

        data = []
        for training in assigned_trainings:
            cert_exists = Certificate.objects.filter(user=user, training=training).exists()
            data.append({
                "id": training.id,
                "name": training.name,
                "venue": training.venue,
                "start_date": training.start_date,
                "end_date": training.end_date,
                "code": training.code,
                "certificate_generated": cert_exists,  # ✅ Include this
            })
        return Response(data)


from .models import Rejection
from .serializers import RejectionSerializer
from django.core.mail import send_mail

class RejectTraineeAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RejectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trainee = serializer.validated_data['trainee']
        training = serializer.validated_data['training']
        reason = serializer.validated_data['reason']

        # Check permission
        if training.faculty != request.user:
            return Response(
                {"error": "You are not authorized to reject this trainee for this training."},
                status=status.HTTP_403_FORBIDDEN
            )
        
         # Prevent duplicate rejections
        if Rejection.objects.filter(trainee=trainee, training=training).exists():
            return Response(
                {"error": "This trainee has already been rejected for this training."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete enrollment
        Enrollment.objects.filter(trainee=trainee, training=training).delete()

        # Save rejection
        rejection = Rejection.objects.create(
            trainee=trainee,
            training=training,
            rejected_by=request.user,
            reason=reason
        )

        # Send polite, personalized email
        subject = "Training Rejection Notification"
        message = f"""Dear {trainee},

We regret to inform you that your nomination for the training program titled 
"{training.name}" has been declined.

Reason: {reason}

We appreciate your interest, and we encourage you to apply for future opportunities.

Warm regards,
Training Coordination Team
"""

        send_mail(
            subject=subject,
            message=message,
            from_email="harshittiwari309@gmail.com",
            recipient_list=[trainee.email],
            fail_silently=False,
        )

        response_data = RejectionSerializer(rejection).data
        return Response(
            {"message": "Trainee rejected and notified.", "rejection": response_data},
            status=status.HTTP_200_OK
        )



class RejectionNotificationAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all rejections for the logged-in trainee
        rejections = Rejection.objects.filter(trainee=request.user).order_by('-created_at')
        serializer = RejectionSerializer(rejections, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Mark all unread rejections as read
        Rejection.objects.filter(trainee=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'Notifications marked as read'})
    


class MarkRejectionAsReadAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            rejection = Rejection.objects.get(pk=pk, trainee=request.user)
            rejection.is_read = True
            rejection.save()
            return Response({"message": "Marked as read."}, status=status.HTTP_200_OK)
        except Rejection.DoesNotExist:
            return Response({"error": "Not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)



class DeleteRejectionAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            rejection = Rejection.objects.get(pk=pk, trainee=request.user)
            rejection.delete()
            return Response({'message': 'Rejection deleted'}, status=status.HTTP_204_NO_CONTENT)
        except Rejection.DoesNotExist:
            return Response({'error': 'Rejection not found'}, status=status.HTTP_404_NOT_FOUND)
