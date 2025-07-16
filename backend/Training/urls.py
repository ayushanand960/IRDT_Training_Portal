# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import TrainingProgramViewSet

# # router = DefaultRouter()
# # router.register(r'training-programs', TrainingProgramViewSet)

# urlpatterns = [
#     # path('', include(router.urls)),
#     path('training-programs/', TrainingProgramViewSet.as_view(), name='training-programs'),
# ]

from django.urls import path
from .views import (
    TrainingProgramListCreateAPIView,
    TrainingProgramRetrieveUpdateDeleteAPIView,
    TrainingUploadExcelAPIView,
)
from .views import NominationCreateAPIView,CoordinatorTrainingDetailView, EnrolledTraineesByTrainingAPIView,BulkNominationView

urlpatterns = [
    path('training-programs/', TrainingProgramListCreateAPIView.as_view(), name='training-list-create'),
    path('training-programs/<str:code>/', TrainingProgramRetrieveUpdateDeleteAPIView.as_view(), name='training-rud'),
    path('training-programs/upload/', TrainingUploadExcelAPIView.as_view(), name='training-upload'),
     path('nominations/', NominationCreateAPIView.as_view(), name='nominate-trainee'),
    path('coordinator/trainings/', CoordinatorTrainingDetailView.as_view(), name='coordinator-trainings'),
    path('enrolled-trainees/<str:training_code>/', EnrolledTraineesByTrainingAPIView.as_view(), name='enrolled-trainees'),
    path('nominate-multiple/', BulkNominationView.as_view(), name='bulk-nominate'),
]
