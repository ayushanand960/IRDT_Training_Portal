from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class Training(models.Model):
    code = models.CharField(_("Code"), max_length=50, primary_key=True)
    name = models.CharField(_("Program Name"), max_length=255)
    target_group = models.TextField(_("Target Group"), blank=True, null=True)  # branch in mobile

    VENUE_CHOICES = [
        ('IRDT', 'IRDT'),
        ('NITTTR Chandigarh', 'NITTTR Chandigarh'),
        ('NITTTR Bhopal', 'NITTTR Bhopal'),
        ('IUCTE, Varanasi(UP)', 'IUCTE, Varanasi(UP)'),
        ('ESTC Ramnagar', 'ESTC Ramnagar'),
        ('IET, Luckhnow(UP)', 'IET, Luckhnow(UP)'),
        ('NCB Ballabgarh (Out Station)', 'NCB Ballabgarh (Out Station)'),
    ]
    venue = models.CharField(_("Venue"), max_length=100, choices=VENUE_CHOICES, blank=True, null=True)

    MODE_CHOICES = [
        ('Contact', 'Contact'),
        ('Online', 'Online'),
        ('Hybrid', 'Hybrid'),
    ]
    mode = models.CharField(_("Mode"), max_length=20, choices=MODE_CHOICES, blank=True, null=True)  # node in mobile

    TRAINING_TYPE_CHOICES = [
        ('T', 'Training'),
        ('NT', 'Non-Training'),
    ]
    training_type = models.CharField(_("Training Type"), max_length=5, choices=TRAINING_TYPE_CHOICES, blank=True, null=True)

    start_date = models.DateField(_("Start Date"))
    end_date = models.DateField(_("End Date"))

    faculty = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        to_field='ehrms_code',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='coordinated_trainings',
        limit_choices_to={'is_coordinator': True},
        verbose_name=_("Coordinator")
    )

    faculty_name = models.CharField(_("Faculty Name"), max_length=150, blank=True)
    number_of_participants = models.PositiveIntegerField(_("No. of Participants"), blank=True, null=True)
    remark = models.CharField(_("Remark"), max_length=255, blank=True, null=True)
    status = models.CharField(_("Status"), max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Training Program"
        verbose_name_plural = "Training Programs"
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.code or 'No Code'} - {self.name or 'Unnamed'}"

    def clean(self):
        super().clean()

        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError(_("End date cannot be earlier than start date."))

        if self.number_of_participants and self.number_of_participants > 1000:
            raise ValidationError(_("Participant number seems too high. Please verify."))
