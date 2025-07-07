from rest_framework import viewsets, permissions, throttling
from .models import TrainingProgram
from .serializers import TrainingProgramSerializer

class TrainingProgramViewSet(viewsets.ModelViewSet):
    queryset = TrainingProgram.objects.all()
    serializer_class = TrainingProgramSerializer

    # ✅ Restrict API access to authenticated users only
    permission_classes = [permissions.IsAuthenticated]

    # ✅ Rate limiting per user (defined globally or here)
    throttle_classes = [throttling.UserRateThrottle]


