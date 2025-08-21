from django.db import models
from django.core.exceptions import ValidationError
from Login.models import User
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class TrainingProgram(models.Model):
    code = models.CharField(_("Code"), max_length=50, primary_key=True)
    name = models.CharField(_("Program Name"), max_length=255)
    target_group = models.TextField(_("Target Group"), blank=True, null=True)

    VENUE_CHOICES = [
        ('IRDT', 'IRDT'),
        ('NITTTR Chandigarh', 'NITTTR Chandigarh'),
        ('NITTTR Bhopal', 'NITTTR Bhopal'),
        ('IUCTE, Varanasi(UP)', 'IUCTE, Varanasi(UP)'),
        ('ESTC Ramnagar','ESTC Ramnagar'),
        ('IET, Luckhnow(UP)', 'IET, Luckhnow(UP)'),
        ('NCB Ballabgarh (Out Station)', 'NCB Ballabgarh (Out Station)'),
    ]
    venue = models.CharField(_("Venue"), max_length=100, choices=VENUE_CHOICES, blank=True, null=True)

    MODE_CHOICES = [
        ('Contact', 'Contact'),
        ('Online', 'Online'),
    ]
    mode = models.CharField(_("Mode"), max_length=20, choices=MODE_CHOICES, blank=True, null=True)

    TRAINING_TYPE_CHOICES = [
        ('T', 'Training'),
        ('NT', 'Non-Training'),
    ]
    training_type = models.CharField(_("Training Type"), max_length=5, choices=TRAINING_TYPE_CHOICES, blank=True, null=True)

    start_date = models.DateField(_("Start Date"))
    end_date = models.DateField(_("End Date"))
    # faculty = models.CharField(_("Faculty"), max_length=100, blank=True, null=True)
    faculty = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    to_field='ehrms_code',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    limit_choices_to={'is_coordinator': True},
    related_name='coordinated_trainings',
    verbose_name=_("Coordinator")
)
    
    faculty_name = models.CharField(max_length=150, blank=True) 
    number_of_participants = models.PositiveIntegerField(_("No. of Participants"), blank=True, null=True)
    remark = models.CharField(_("Remark"), max_length=255, blank=True, null=True)
    status = models.CharField(_("Status"), max_length=100, blank=True, null=True)
    is_finalized = models.BooleanField(default=False)
    finalized_at = models.DateTimeField(null=True, blank=True)
    finalized_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='finalized_trainings'
    )
    edit_requested = models.BooleanField(default=False)
    edit_request_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('null', 'null')],
        default='null',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Training Program"
        verbose_name_plural = "Training Programs"
        ordering = ['-start_date']

    def __str__(self):
        code_display = self.code if self.code else "No Code"
        name_display = self.name if self.name else "Unnamed"
        return f"{code_display} - {name_display}"

    def clean(self):
        super().clean()

        # Ensure end_date is not before start_date
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError(_("End date cannot be earlier than start date."))

        # Participants should be realistic (0–1000 limit)
        if self.number_of_participants and (self.number_of_participants > 1000):
            raise ValidationError(_("Participant number seems too high. Please verify."))
    

    batch_upload = models.ForeignKey(
    'TrainingBatchUpload',
    on_delete=models.CASCADE,
    related_name='trainings',
    null=True,
    blank=True
    )

        
#-----------------------------------------------------------------------------------------------


class Nomination(models.Model):
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'is_coordinator': False})
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE)
    nominated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='nominations_made')
    coordinator = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=True,related_name="coordinator_trainings")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.trainee} → {self.training.name}"
    

class Rejection(models.Model):
    trainee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rejections")
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name="rejections")
    rejected_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="rejections_made")
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.trainee} rejected from {self.training.name}"



class TrainingBatchUpload(models.Model):
    upload_id = models.CharField(max_length=20, unique=True)  # e.g. '2025-26'
    session_year = models.CharField(max_length=9,blank=False,null=True)  # Add this
    upload_date = models.DateField(blank=False,null=True)  # Add this
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.upload_id
