# from rest_framework import viewsets, permissions, throttling
# from .models import TrainingProgram
# from .serializers import TrainingProgramSerializer

# class TrainingProgramViewSet(viewsets.ModelViewSet):
#     queryset = TrainingProgram.objects.all()
#     serializer_class = TrainingProgramSerializer

#     # ✅ Restrict API access to authenticated users only
#     permission_classes = [permissions.IsAuthenticated]

#     # ✅ Rate limiting per user (defined globally or here)
#     throttle_classes = [throttling.UserRateThrottle]


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

    def get_object(self, pk):
        return get_object_or_404(TrainingProgram, pk=pk)

    def get(self, request, pk):
        training = self.get_object(pk)
        serializer = TrainingProgramSerializer(training)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        training = self.get_object(pk)
        serializer = TrainingProgramSerializer(training, data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Training updated: {training.code}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.warning(f"Training update failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        training = self.get_object(pk)
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
            return Response({"error": f"Failed to process file: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
