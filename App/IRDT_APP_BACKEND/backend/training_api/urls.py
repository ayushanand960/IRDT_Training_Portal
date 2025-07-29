from django.urls import path
from .views import TrainingListView

urlpatterns = [
    path('trainings/', TrainingListView.as_view(), name='training-list'),
]
