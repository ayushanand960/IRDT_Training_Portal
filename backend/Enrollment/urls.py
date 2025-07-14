from django.urls import path
from .views import EnrollTrainingView, MyEnrollmentsView

urlpatterns = [
    path('enroll/', EnrollTrainingView.as_view(), name='enroll-training'),
    path('my-enrollments/', MyEnrollmentsView.as_view(), name='my-enrollments'),
]
