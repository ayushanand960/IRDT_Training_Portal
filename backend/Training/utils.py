from datetime import timedelta
from django.utils import timezone
from .models import TrainingAttendance, Nomination

def is_staff_eligible(staff, training):
    two_months_ago = training.start_date - timedelta(days=60)
    
    has_recent_attendance = TrainingAttendance.objects.filter(
        staff=staff,
        date_attended__gte=two_months_ago
    ).exists()

    has_future_nomination = Nomination.objects.filter(
        staff=staff,
        training__start_date__gte=timezone.now().date()
    ).exists()

    return not (has_recent_attendance or has_future_nomination)

