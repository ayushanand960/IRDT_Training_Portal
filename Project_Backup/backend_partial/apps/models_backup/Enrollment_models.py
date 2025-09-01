

from django.conf import settings
from django.db import models
from Training.models import TrainingProgram

class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('nominated', 'Nominated'),
        ('attended', 'Attended'),
    ]

    trainee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='ehrms_code',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    is_finalized = models.BooleanField(default=False)
    finalized_at = models.DateTimeField(null=True, blank=True)
    notification_read = models.BooleanField(default=False)



    class Meta:
        unique_together = ('trainee', 'training')  # prevent duplicate enrollment

    def __str__(self):
        return f"{self.trainee} enrolled in {self.training} ({self.status})"
