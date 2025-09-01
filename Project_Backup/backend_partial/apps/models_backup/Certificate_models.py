from django.db import models
from django.contrib.auth import get_user_model
from Training.models import TrainingProgram

User = get_user_model()

class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificates')
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='certificates')
    full_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    issued_date = models.DateField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_certificates')
    certificate_file = models.FileField(upload_to='certificates/') 
    def __str__(self):
        return f"{self.full_name} - {self.training.name}"
