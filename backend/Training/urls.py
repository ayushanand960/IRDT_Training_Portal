from django.urls import path
from .views import (
    TrainingProgramListCreateAPIView,
    TrainingProgramRetrieveUpdateAPIView,
    EligibleStaffAPIView,
    NominateStaffAPIView
)

app_name = "training"

urlpatterns = [
    # Training Program APIs
    path('training-programs/', TrainingProgramListCreateAPIView.as_view(), name='list-create'),
    path('training-programs/<int:pk>/', TrainingProgramRetrieveUpdateAPIView.as_view(), name='detail-update'),

    # Nomination Endpoints
    path('training-programs/<int:training_id>/eligible-staff/', EligibleStaffAPIView.as_view(), name='eligible-staff'),
    path('training-programs/nominate/', NominateStaffAPIView.as_view(), name='nominate'),
]
