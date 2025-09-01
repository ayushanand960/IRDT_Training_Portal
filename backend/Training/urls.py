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
    UploadTrainingExcelAPIView,
    DashboardMetricsAPIView,
    RequestEditAPIView,
    PastTrainingsAPIView,
    ApproveEditRequestAPIView,
    NominationNotificationListAPIView,
     MarkNominationNotificationReadAPIView,
    DeleteTrainingBatchAPIView,download_curriculum_excel,RejectRemainingTraineesAPIView
)
from .views import CoordinatorTrainingDetailView, EnrolledTraineesByTrainingAPIView,BulkNominationView,NominatedTraineesByTrainingAPIView,RemoveNominationAPIView, FinalizeNominationAPIView, DownloadFinalNominationXLSXAPIView, AttendedTraineesAPIView, FinalizedNominationsListView
from .views import AssignedTrainingsView , RejectTraineeAPIView, RejectionNotificationAPIView, MarkRejectionAsReadAPIView, DeleteRejectionAPIView ,  CurriculumListAPIView
urlpatterns = [
    path('training-programs/', TrainingProgramListCreateAPIView.as_view(), name='training-list-create'),
    path('training-programs/<str:code>/', TrainingProgramRetrieveUpdateDeleteAPIView.as_view(), name='training-rud'),
    path('upload-excel/', UploadTrainingExcelAPIView.as_view(), name='upload_training_excel'),
    path('delete-batch/<str:upload_id>/', DeleteTrainingBatchAPIView.as_view(), name='delete_training_batch'),
    path("dashboard/metrics/", DashboardMetricsAPIView.as_view()),
    # path('nominations/', NominationCreateAPIView.as_view(), name='nominate-trainee'),
    path('coordinator/trainings/', CoordinatorTrainingDetailView.as_view(), name='coordinator-trainings'),
    path('enrolled-trainees/<str:training_code>/', EnrolledTraineesByTrainingAPIView.as_view(), name='enrolled-trainees'),
    path('nominate-multiple/', BulkNominationView.as_view(), name='bulk-nominate'),
    path('nominated/<str:training_code>/', NominatedTraineesByTrainingAPIView.as_view()),
    path("attended/<str:code>/", AttendedTraineesAPIView.as_view()),
    path('nomination/remove/<str:training_code>/<str:ehrms_code>/', RemoveNominationAPIView.as_view()),
    path('trainings/assigned/', AssignedTrainingsView.as_view(), name='assigned-trainings'),
    path('rejections/', RejectTraineeAPIView.as_view(), name='reject-trainee'),
    path('notification/rejections/', RejectionNotificationAPIView.as_view(), name='reject-notification'),
    path('notification/rejections/<int:pk>/read/', MarkRejectionAsReadAPIView.as_view(), name='mark-rejection-read'),
    path('notification/rejections/<int:pk>/delete/', DeleteRejectionAPIView.as_view(), name='delete-rejection'),
    path("notification/nominations/", NominationNotificationListAPIView.as_view(), name="nomination-notifications"),
    path("notification/nominations/<int:enrollment_id>/read/", MarkNominationNotificationReadAPIView.as_view(), name="mark-nomination-read"),
    path('finalize-nominations/<str:training_code>/', FinalizeNominationAPIView.as_view(), name='finalize-nominations'),
    path('download-final-nominations/<str:training_code>/', DownloadFinalNominationXLSXAPIView.as_view(), name='download-final-csv'),
    path("finalized-nominations/", FinalizedNominationsListView.as_view(), name="finalized-nominations-list"),
    path('request-edit/<str:training_code>/', RequestEditAPIView.as_view(), name='request-edit'),
    path('approve-edit/<str:training_code>/', ApproveEditRequestAPIView.as_view(), name='approve-edit'),
    path('past-trainings/', PastTrainingsAPIView.as_view(), name='past-trainings'),
    path('curriculum/', CurriculumListAPIView.as_view(), name='curriculum-list'),
    path("curriculum/download/", download_curriculum_excel, name="curriculum-download"),
    path('reject-remaining/<str:training_code>/', RejectRemainingTraineesAPIView.as_view(), name='reject-remaining'),
]


