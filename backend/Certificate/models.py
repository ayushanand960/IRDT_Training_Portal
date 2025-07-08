from django.db import models
from django.contrib.auth import get_user_model
from Training.models import TrainingProgram

User = get_user_model()

class Certificate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="certificates")
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name="certificates")
    file = models.FileField(upload_to='certificates/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user_display = getattr(self.user, 'email', str(self.user))
        return f"{user_display} - {self.training.code}"


