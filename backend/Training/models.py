from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

User = get_user_model()


class TeachingStaff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(_("Name"), max_length=255)
    branch = models.CharField(_("Branch"), max_length=100)
    experience = models.PositiveIntegerField(_("Experience (Years)"))

    def __str__(self):
        return self.name


class TrainingProgram(models.Model):
    code = models.CharField(_("Code"), max_length=50, blank=True, null=True)
    name = models.CharField(_("Program Name"), max_length=255)
    target_group = models.TextField(_("Target Group"), blank=True, null=True)

    VENUE_CHOICES = [
        ('IRDT', 'IRDT'),
        ('NITTTR Chandigarh', 'NITTTR Chandigarh'),
        ('NITTTR Bhopal', 'NITTTR Bhopal'),
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
    faculty = models.CharField(_("Faculty"), max_length=100, blank=True, null=True)
    number_of_participants = models.PositiveIntegerField(_("No. of Participants"), blank=True, null=True)
    remark = models.CharField(_("Remark"), max_length=255, blank=True, null=True)
    status = models.CharField(_("Status"), max_length=100, blank=True, null=True)

    coordinator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="coordinated_trainings"
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
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError(_("End date cannot be earlier than start date."))
        if self.number_of_participants and self.number_of_participants > 1000:
            raise ValidationError(_("Participant number seems too high. Please verify."))


class TrainingAttendance(models.Model):
    staff = models.ForeignKey(TeachingStaff, on_delete=models.CASCADE, related_name='attendances')
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='attendances')
    date_attended = models.DateField()

    def __str__(self):
        return f"{self.staff.name} - {self.training.name}"


class Nomination(models.Model):
    staff = models.ForeignKey(TeachingStaff, on_delete=models.CASCADE, related_name='nominations')
    training = models.ForeignKey(TrainingProgram, on_delete=models.CASCADE, related_name='nominations')
    nominated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    date_nominated = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('staff', 'training')

    def __str__(self):
        return f"{self.staff.name} nominated for {self.training.name}"
