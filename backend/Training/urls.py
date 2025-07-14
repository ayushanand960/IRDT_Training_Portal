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

urlpatterns = [
    path('training-programs/', TrainingProgramListCreateAPIView.as_view(), name='training-list-create'),
    path('training-programs/<str:code>/', TrainingProgramRetrieveUpdateDeleteAPIView.as_view(), name='training-rud'),
    path('training-programs/upload/', TrainingUploadExcelAPIView.as_view(), name='training-upload'),
]
