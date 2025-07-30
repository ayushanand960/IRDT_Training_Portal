# from django.conf import settings
# from django.db import models
# from Training.models import TrainingProgram

# class Enrollment(models.Model):
#     trainee = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         to_field='ehrms_code',  # use ehrms_code as FK reference
#         on_delete=models.CASCADE,
#         related_name='enrollments'
#     )
#     training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE)
#     enrolled_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('trainee', 'training')  # Prevent duplicate enrollments

#     def __str__(self):
#         return f"{self.trainee} enrolled in {self.training}"


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

    class Meta:
        unique_together = ('trainee', 'training')  # prevent duplicate enrollment

    def __str__(self):
        return f"{self.trainee} enrolled in {self.training} ({self.status})"
