from rest_framework import generics
from .models import Training
from .serializers import TrainingSerializer
from .filters import TrainingFilter
from django.utils.timezone import now
from datetime import timedelta


class TrainingListView(generics.ListAPIView):
    serializer_class = TrainingSerializer
    filterset_class = TrainingFilter

    def get_queryset(self):
        queryset = Training.objects.all()
        start = self.request.query_params.get('start_date')
        if not start:
            today = now().date()
            future = today + timedelta(days=15)
            queryset = queryset.filter(start_date__range=(today, future))
        return queryset
