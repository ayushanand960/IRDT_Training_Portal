from django.db import models
from django.core.exceptions import ValidationError
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
    faculty = models.CharField(_("Faculty"), max_length=100, blank=True, null=True)
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
#         import pandas as pd
# from datetime import datetime
# from django.utils.timezone import make_aware
# from training.models import TrainingProgram

# # Load Excel
# file_path = "Training Calendar 2025-26 Final.xlsx"
# df = pd.read_excel(file_path, sheet_name="Training Calendar 2025-26")

# # Drop completely empty rows
# df = df.dropna(subset=["Code", "Name of Programme"])

# # Fix column names
# df = df.rename(columns={
#     "Code": "code",
#     "Name of Programme": "name",
#     "Target Group": "target_group",
#     "Venue": "venue",
#     "Mode": "mode",
#     "T/NT": "training_type",
#     "Start Date": "start_date",
#     "End Date": "end_date",
#     "Faculy": "faculty",
#     "No.": "number_of_participants",
#     "Remark": "remark",
#     "Status": "status"
# })

# # Clean and import row by row
# for _, row in df.iterrows():
#     try:
#         # Convert dates and participants
#         start_date = pd.to_datetime(row['start_date'], dayfirst=False, errors='coerce')
#         end_date = pd.to_datetime(row['end_date'], dayfirst=False, errors='coerce')
#         if pd.notnull(start_date):
#             start_date = make_aware(start_date)
#         if pd.notnull(end_date):
#             end_date = make_aware(end_date)

#         number_of_participants = int(row['number_of_participants']) if not pd.isna(row['number_of_participants']) else None

#         TrainingProgram.objects.create(
#             code=row['code'],
#             name=row['name'],
#             target_group=row['target_group'],
#             venue=row['venue'],
#             mode=row['mode'],
#             training_type=row['training_type'],
#             start_date=start_date.date() if start_date else None,
#             end_date=end_date.date() if end_date else None,
#             faculty=row['faculty'],
#             number_of_participants=number_of_participants,
#             remark=row['remark'],
#             status=row['status']
#         )
#         print(f"Imported: {row['code']} - {row['name']}")
#     except Exception as e:
#         print(f"❌ Error importing {row.get('code', 'UNKNOWN')}: {e}")

