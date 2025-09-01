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

from .models import TrainingProgram ,TrainingBatchUpload
from .serializers import TrainingProgramSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
# from Training.models import Nomination
from Enrollment.models import Enrollment
from rest_framework import serializers
from Login.serializers import UserSerializer
from django.utils import timezone
from django.http import HttpResponse
import csv
from io import BytesIO
from openpyxl import Workbook

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
# from .models import Nomination
from .serializers import NominationSerializer

# class NominationCreateAPIView(generics.CreateAPIView):
#     queryset = Nomination.objects.all()
#     serializer_class = NominationSerializer
#     authentication_classes = [CookieJWTAuthentication]
#     permission_classes = [permissions.IsAuthenticated]

User = get_user_model()

class CoordinatorTrainingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        coordinator = request.user
        trainings = TrainingProgram.objects.filter(coordinator=coordinator)

        data = []
        for training in trainings:
            # nominations = Nomination.objects.filter(training=training)
            enrollments = Enrollment.objects.filter(training=training, status='nominated').select_related('trainee')
            trainees = [{
                "ehrms_code": nom.trainee.ehrms_code,
                "name": nom.trainee.name
            } for nom in enrollments]

            data.append({
                "training_title": training.name,
                "venue": training.venue,
                "dates": f"{training.start_date} to {training.end_date}",
                "trainee_count": enrollments.count(),
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
        
        if training.is_finalized:
            return Response({"error": "Nominations are finalized. Editing is not allowed."}, status=status.HTTP_403_FORBIDDEN)

        created = []
        skipped = []
        for ehrms_code in ehrms_codes:
            try:
                trainee = User.objects.get(ehrms_code=ehrms_code)
                enrollment, enrollment_created = Enrollment.objects.get_or_create(
                    training=training,
                    trainee=trainee,
                    defaults={"status": "nominated"}
                )
                # from Enrollment.models import Enrollment
                # enrollment, enrollment_created = Enrollment.objects.get_or_create(
                #     trainee=trainee,
                #     training=training,
                #     defaults={"status": "nominated"}
                # )
                if not enrollment_created and enrollment.status != 'nominated':
                    enrollment.status = 'nominated'
                    enrollment.save()
                if enrollment_created:
                    created.append(ehrms_code)
                else:
                    skipped.append(ehrms_code)
            except User.DoesNotExist:
                continue

        return Response({
            "nominated": created,
            "skipped": skipped,
            "message": f"{len(created)} trainee(s) nominated. {len(skipped)} skipped."
        }, status=status.HTTP_200_OK)

class NominatedTraineesByTrainingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found or not authorized."}, status=403)

        # if training.is_finalized:
        #     return Response({"error": "Nominations are finalized. Editing is not allowed."}, status=status.HTTP_403_FORBIDDEN)

        # nominations = Nomination.objects.filter(training=training).select_related('trainee')
        enrollments = Enrollment.objects.filter(training=training, status='nominated').select_related('trainee')
        trainees = [e.trainee for e in enrollments]
        serializer = UserSerializer(trainees, many=True)
        return Response(serializer.data)
    
class AttendedTraineesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        trainees = User.objects.filter(
        enrollments__training__code=code,  # ✅ correct related name
        enrollments__status="attended"
        ).distinct()

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

        # Step 4: Check if final nomination already submitted
        if training.is_finalized:
            return Response({"error": "Nominations are finalized. Editing is not allowed."}, status=status.HTTP_403_FORBIDDEN)

        
        # Step 4: Delete Nomination
        # Nomination.objects.filter(training=training, trainee=trainee).delete()

        # Step 5: Update Enrollment status to 'applied' if it was 'nominated'
        enrollment = Enrollment.objects.filter(training=training, trainee=trainee).first()
        if enrollment and enrollment.status == "nominated":
            enrollment.status = "applied"
            enrollment.save()

            return Response({"message": "Nomination removed and enrollment status reverted to 'applied'."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Trainee is not currently nominated."}, status=status.HTTP_400_BAD_REQUEST)

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
            from_email="irdtknp@gmail.com",
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





from django.utils import timezone
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class NominationNotificationListAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get finalized nominations of the current trainee
        enrollments = Enrollment.objects.filter(
            trainee=request.user,
            status="nominated",
            is_finalized=True,
            notification_read=False 
        ).select_related("training").order_by("-finalized_at")

        notifications = []
        for e in enrollments:
            notifications.append({
                "id": e.id,  # using enrollment id as unique notification id
                "training_code": e.training.code,
                "training_name": e.training.name,
                "message": f"Your nomination for {e.training.name} has been finalized.",
                "is_read": e.notification_read if hasattr(e, "notification_read") else False,
                "created_at": e.finalized_at,
            })

        return Response(notifications, status=status.HTTP_200_OK)



class MarkNominationNotificationReadAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, enrollment_id):
        try:
            enrollment = Enrollment.objects.get(
                id=enrollment_id,
                trainee=request.user,
                status="nominated",
                is_finalized=True
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"error": "Notification not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        enrollment.notification_read = True
        enrollment.save()
        return Response({"message": "Notification marked as read."}, status=status.HTTP_200_OK)

class FinalizeNominationAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, training_code):
        #  Get training & check permission
        try:
            training = TrainingProgram.objects.get(code=training_code)
        except TrainingProgram.DoesNotExist:
            return Response(
                {"error": "Training not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if training.faculty != request.user:
            return Response(
                {"error": "You are not authorized to finalize nominations for this training."},
                status=status.HTTP_403_FORBIDDEN
            )

        #  Prevent duplicate finalization
        if training.is_finalized:
            return Response(
                {"error": "This training's nominations have already been finalized."},
                status=status.HTTP_400_BAD_REQUEST
            )

        #  Get nominated trainees
        enrollments = Enrollment.objects.filter(
            training=training,
            status="nominated",
            is_finalized=False
        ).select_related("trainee")

        if not enrollments.exists():
            return Response(
                {"error": "No nominated trainees found to finalize."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark trainees as finalized
        for enrollment in enrollments:
            enrollment.is_finalized = True
            enrollment.finalized_at = timezone.now()
            enrollment.save()

        # Update training record
        training.is_finalized = True
        training.finalized_at = timezone.now()
        training.finalized_by = request.user
        training.save()

    # Email logic 
        trainee_emails = [enrollment.trainee.email for enrollment in enrollments if enrollment.trainee.email]

        emails_sent, emails_failed = [], []
        if trainee_emails:
            subject = f"Nomination Finalized for Training {training.name}"
            body = f"""Dear Trainee,

Congratulations! Your nomination for the training program has been finalized.

Training Details:
- Program: {training.name}
- Dates: {training.start_date} to {training.end_date}
- Faculty: {training.faculty_name}

If you have any issue or require clarification, please feel free to contact your principal within two to three days so that principal could contact the coordinator of this training.

We look forward to your participation. Please await further instructions.


Warm regards,
Training Coordination Team
"""

            try:
                email = EmailMessage(
                    subject=subject,
                    body=body,
                    from_email="irdtknp@gmail.com",
                    to=["noreply@irdt.com"],   # required main recipient
                    cc=trainee_emails,          # ✅ send to all finalized trainees
                )
                email.send(fail_silently=False)
                emails_sent = trainee_emails
            except Exception as e:
                emails_failed = [f"(Error: {e})"]

        # Response
        return Response(
            {
                "message": f"{len(emails_sent)} nomination(s) finalized for training '{training.name}'.",
                "emails_sent": emails_sent,
                "emails_failed": emails_failed,
                "finalized": True,
            },
            status=status.HTTP_200_OK
        )
    
class FinalizedNominationsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        # ✅ Order by finalized_at descending (recent on top)
        finalized_trainings = TrainingProgram.objects.filter(
            is_finalized=True
        ).select_related("faculty").order_by("-finalized_at")

        data = []
        for t in finalized_trainings:
            # ✅ Check if all nominations are attended
            all_attended = Enrollment.objects.filter(
                training=t, is_finalized=True
            ).exclude(status='attended').count() == 0

            data.append({
                "code": t.code,
                "name": t.name,
                "faculty": f"{t.faculty.first_name} {t.faculty.middle_name or ''} {t.faculty.last_name}".strip() if t.faculty else "N/A",
                "finalized_at": t.finalized_at.isoformat() if t.finalized_at else None,
                "is_completed": all_attended,
                "edit_request_status": t.edit_request_status,
                "edit_requested": t.edit_requested,
            })

        return Response(data, status=200)



class DownloadFinalNominationXLSXAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found."}, status=404)

        if not (request.user == training.faculty or request.user.is_superuser):
            return Response({"error": "Unauthorized."}, status=403)

        if not training.is_finalized:
            return Response({"error": "Training has not been finalized yet."}, status=400)

        enrollments = Enrollment.objects.filter(
            training=training,
            status='nominated',
            is_finalized=True
        ).select_related('trainee')

        if not enrollments.exists():
            return Response({"error": "No finalized nominations yet."}, status=404)

        # Prepare data
        data = []
        for e in enrollments:
            t = e.trainee
            full_name = f"{t.first_name or ''} {t.middle_name or ''} {t.last_name or ''}".strip()
            data.append({
                'EHRMS Code': t.ehrms_code,
                'Full Name': full_name,
                'Email': t.email,
                'Phone': t.mobile_number or '',
                'Designation': t.designation or '',
                'Branch': t.branch or '',
                'Institute': t.institute_name or t.institute or ''
            })

        df = pd.DataFrame(data)

        # Save to XLSX in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Final Nominations')
        output.seek(0)

        # Return XLSX response
        response = HttpResponse(
           output.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename=FinalNominations_{training.code}.xlsx'
        return response
    


class RequestEditAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found or not assigned to you."}, status=404)

        if not training.is_finalized:
            return Response({"message": "Training is not finalized. No need to request edit."})

        training.edit_requested = True
        training.edit_request_status = "pending"
        training.save()

        return Response({"message": "✅ Edit request submitted."})
    


class ApproveEditRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, training_code):
        if not request.user.is_superuser:
            return Response({"error": "Only admin can perform this action."}, status=403)

        try:
            training = TrainingProgram.objects.get(code=training_code)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found."}, status=404)

        action = request.data.get("action")  # 'approve' or 'reject'
        if action == "approve":
            training.edit_request_status = "approved"
            training.edit_requested = False
            training.is_finalized = False  # allow changes again
            message = "✅ Edit request approved."
        elif action == "reject":
            training.edit_request_status = "rejected"
            training.edit_requested = False
            message = "❌ Edit request rejected."
        else:
            return Response({"error": "Invalid action. Use 'approve' or 'reject'."}, status=400)

        training.save()
        return Response({"message": message}, status=200)
    
class PastTrainingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ehrms_code = request.query_params.get("ehrms_code")
        today = date.today()

        if ehrms_code:
            try:
                user = User.objects.get(ehrms_code=ehrms_code)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        else:
            user = request.user

        enrollments = Enrollment.objects.filter(
            trainee=user,
            training__end_date__lt=today
        ).select_related('training')

        past_trainings = [enrollment.training for enrollment in enrollments]
        serializer = TrainingProgramSerializer(past_trainings, many=True)
        return Response(serializer.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from django.db import transaction
from rest_framework.permissions import IsAdminUser

import pandas as pd
from datetime import datetime
import random

from Training.models import TrainingProgram, TrainingBatchUpload
from uuid import uuid4
class UploadTrainingExcelAPIView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAdminUser]

    def post(self, request):
        excel_file = request.FILES.get("file")
        session_year = request.POST.get("session_year")
        upload_date = request.POST.get("upload_date")

        if not all([excel_file, session_year, upload_date]):
            return Response({"error": "Missing required fields."}, status=400)

        try:
            df = pd.read_excel(excel_file)
        except Exception as e:
            return Response({"error": f"Failed to read Excel file: {e}"}, status=400)

        try:
            upload_date_obj = datetime.strptime(upload_date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid upload_date format. Use YYYY-MM-DD."}, status=400)

        # Rename columns for consistency
        df.rename(columns={
            'Name of Programme': 'name',
            'Target Group': 'target_group',
            'Venue': 'venue',
            'Mode': 'mode',
            'Training Type': 'training_type',
            'Start Date': 'start_date',
            'End Date': 'end_date',
            'Faculty': 'faculty_name',
            'No.': 'number_of_participants',
            'Remark': 'remark',
            'Status': 'status',
        }, inplace=True)

        with transaction.atomic():
            unique_id = str(uuid4())[:8]
            batch = TrainingBatchUpload.objects.create(
                upload_id=f"{session_year}-{unique_id}",
                session_year=session_year,
                upload_date=upload_date_obj,
                uploaded_by=request.user
            )

            created_or_updated = 0

            for index, row in df.iterrows():
                code = str(row.get("Code", "")).strip()
                name = str(row.get("name", "")).strip()
                faculty_name = str(row.get("faculty_name", "")).strip()
                start_date = row.get("start_date")
                end_date = row.get("end_date")

                if not code or not name or pd.isna(start_date) or pd.isna(end_date):
                    continue

                try:
                    start_date = pd.to_datetime(start_date).date()
                    end_date = pd.to_datetime(end_date).date()
                except Exception:
                    continue

                # Match or create coordinator
                faculty = None
                for u in User.objects.filter(is_coordinator=True):
                    full = " ".join(filter(None, [u.first_name, u.middle_name, u.last_name])).strip()
                    if full.lower() == faculty_name.lower():
                        faculty = u
                        break

                if not faculty:
                    def generate_unique_ehrms_code():
                        while True:
                            code = str(random.randint(900000, 999999))
                            if not User.objects.filter(ehrms_code=code).exists():
                                return code

                    def split_full_name(full_name):
                        parts = full_name.strip().split()
                        if len(parts) == 1:
                            return parts[0], "", ""
                        elif len(parts) == 2:
                            return parts[0], "", parts[1]
                        else:
                            return parts[0], " ".join(parts[1:-1]), parts[-1]

                    first, middle, last = split_full_name(faculty_name)
                    ehrms_code = generate_unique_ehrms_code()
                    faculty = User.objects.create(
                        ehrms_code=ehrms_code,
                        first_name=first,
                        middle_name=middle,
                        last_name=last,
                        email=f"{ehrms_code}@irdt.in",
                        mobile_number=f"9{random.randint(100000000, 999999999)}",
                        is_coordinator=True,
                        is_staff=False,
                    )
                    faculty.set_password("Irdt@123")
                    faculty.save()

                try:
                    training, created = TrainingProgram.objects.update_or_create(
                        code=code,
                        batch_upload=batch,
                        defaults={
                            'name': name,
                            'target_group': row.get('target_group', ''),
                            'venue': row.get('venue', ''),
                            'mode': row.get('mode', ''),
                            'training_type': row.get('training_type', ''),
                            'start_date': start_date,
                            'end_date': end_date,
                            'faculty': faculty,
                            'faculty_name': faculty_name,
                            'number_of_participants': int(row.get('number_of_participants') or 0),
                            'remark': row.get('remark', ''),
                            'status': row.get('status', ''),
                            'batch_upload': batch
                        }
                    )
                    created_or_updated += 1
                except Exception as e:
                    print(f"❌ Error on row {index+2}: {e}")
                    continue

        return Response({"message": f"Uploaded {created_or_updated} training programs successfully."})
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import TrainingProgram, TrainingBatchUpload
from django.shortcuts import get_object_or_404

class DeleteTrainingBatchAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]  # Only admins can delete

    def delete(self, request, upload_id):
        try:
            # Fetch the batch using the provided upload_id
            batch = get_object_or_404(TrainingBatchUpload, upload_id=upload_id)

            # Delete the batch (trainings will be deleted due to CASCADE)
            batch.delete()

            return Response(
                {"detail": f"Successfully deleted batch {upload_id} and all associated trainings."},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"detail": f"Error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CurriculumListAPIView(APIView):
    permission_classes = []  # public

    def get(self, request):
        session_year = request.query_params.get("session_year")
        trainings = TrainingProgram.objects.all().select_related("batch_upload")

        if session_year:
            trainings = trainings.filter(batch_upload__session_year=session_year)

        serializer = TrainingProgramSerializer(trainings, many=True)
        return Response(serializer.data)


# Training/views.py
import openpyxl
from django.http import HttpResponse
# from .models import TrainingProgram

def download_curriculum_excel(request):
    session_year = request.GET.get("session_year")

    # Filter if session_year is provided
    trainings = TrainingProgram.objects.all()
    if session_year:
        trainings = trainings.filter(batch_upload__session_year=session_year)

    # Create workbook
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Curriculum"

    # Header row
    ws.append(["Code", "Name", "Target Group", "Faculty Name", "Session Year"])

    # Data rows
    for t in trainings:
        ws.append([
            t.code,
            t.name,
            t.target_group,
            t.faculty_name,
            t.batch_upload.session_year if t.batch_upload else ""
        ])

    # Response
    response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    filename = f"Curriculum_{session_year if session_year else 'All'}.xlsx"
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    wb.save(response)
    return response


from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import  Rejection
from .serializers import RejectionSerializer

class RejectRemainingTraineesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, training_code):
        try:
            # 1. Get training
            training = TrainingProgram.objects.get(code=training_code)

            # 2. Already nominated trainees
            nominated_ids = Enrollment.objects.filter(
                training=training, status="nominated"
            ).values_list("trainee_id", flat=True)

            # 3. Remaining trainees (not nominated)
            remaining_enrollments = Enrollment.objects.filter(
                training=training
            ).exclude(trainee_id__in=nominated_ids)

            if not remaining_enrollments.exists():
                return Response({"message": "No remaining trainees to reject."})

            # 4. Update their status to rejected
            remaining_enrollments.update(status="rejected")

            # 5. Create rejection entries + collect emails
            emails = []
            rejection_objects = []
            for en in remaining_enrollments:
                trainee = en.trainee
                if trainee.email:
                    emails.append(trainee.email)

                rejection_objects.append(
                    Rejection(
                        trainee=trainee,
                        training=training,
                        reason=(
                            f"You have not been nominated for the training "
                            f"'{training.name}' scheduled from "
                            f"{training.start_date} to {training.end_date}."
                        ),
                        is_read=False
                    )
                )

            # Bulk create all rejection notifications
            Rejection.objects.bulk_create(rejection_objects)

            # 6. Send one email with CC
            if emails:
                subject = f"Nomination Result for Training {training.name}"
                body = (
                    f"Dear Trainee,\n\n"
                    f"We regret to inform you that you have not been nominated for the training program:\n\n"
                    f"Title: {training.name}\n"
                    f"Dates: {training.start_date} to {training.end_date}\n"
                    f"Venue: {training.venue}\n\n"
                    f"Thank you for your interest.\n\n"
                    f"Regards,\nTraining Coordination Team"
                )

                email = EmailMessage(
                    subject=subject,
                    body=body,
                    from_email="noreply@irdt.com",
                    to=["noreply@irdt.com"],  # required main recipient
                    cc=emails,               # all rejected trainees
                )
                email.send(fail_silently=False)

            return Response({"message": "Remaining trainees rejected, rejection notifications created, and email sent."})

        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found."}, status=404)
