from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from django.utils.translation import gettext_lazy as _

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
    # faculty = models.CharField(_("Faculty"), max_length=100, blank=True, null=True)
    faculty = models.ForeignKey(
    settings.AUTH_USER_MODEL,
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
#         