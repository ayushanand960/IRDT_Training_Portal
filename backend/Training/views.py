from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, throttling
from rest_framework.parsers import MultiPartParser
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

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
    authentication_classes = [JWTAuthentication]
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
    authentication_classes = [JWTAuthentication]
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
    authentication_classes = [JWTAuthentication]
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
            return Response({"error": f"Failed to process file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework import generics
from .models import Nomination
from .serializers import NominationSerializer

class NominationCreateAPIView(generics.CreateAPIView):
    queryset = Nomination.objects.all()
    serializer_class = NominationSerializer
    authentication_classes = [JWTAuthentication]
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
        for ehrms_code in ehrms_codes:
            try:
                trainee = User.objects.get(ehrms_code=ehrms_code)
                nomination, created_flag = Nomination.objects.get_or_create(
                    training=training,
                    trainee=trainee,
                    defaults={"coordinator": request.user, "nominated_by": request.user}
                )
                if created_flag:
                    created.append(ehrms_code)
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

        nominations = Nomination.objects.filter(training=training).select_related('trainee')
        trainees = [n.trainee for n in nominations]
        serializer = UserSerializer(trainees, many=True)
        return Response(serializer.data)


class RemoveNominationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, training_code, ehrms_code):
        try:
            # Confirm the training is assigned to this coordinator
            training = TrainingProgram.objects.get(code=training_code, faculty=request.user)
        except TrainingProgram.DoesNotExist:
            return Response({"error": "Training not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        try:
            trainee = User.objects.get(ehrms_code=ehrms_code)
        except User.DoesNotExist:
            return Response({"error": "Trainee not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            nomination = Nomination.objects.get(training=training, trainee=trainee)
            nomination.delete()
            return Response({"message": "Nomination removed."}, status=status.HTTP_204_NO_CONTENT)
        except Nomination.DoesNotExist:
            return Response({"error": "Nomination not found."}, status=status.HTTP_404_NOT_FOUND)
