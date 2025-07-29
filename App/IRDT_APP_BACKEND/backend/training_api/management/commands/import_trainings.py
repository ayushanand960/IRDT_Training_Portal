import pandas as pd
from django.core.management.base import BaseCommand
from training_api.models import Training
from auth_api.models import User  # assuming your custom user model is in auth_api
from datetime import datetime
import random


class Command(BaseCommand):
    help = 'Import trainings from Excel file'

    def add_arguments(self, parser):
        parser.add_argument('excel_path', type=str, help='Path to the Excel file')

    def handle(self, *args, **kwargs):
        path = kwargs['excel_path']

        try:
            df = pd.read_excel(path)

            df.rename(columns={
                'Code': 'code',
                'Name of Programme': 'name',
                'Target Group': 'target_group',
                'Venue': 'venue',
                'Mode': 'mode',
                'Training Type': 'training_type',
                'Start Date': 'start_date',
                'End Date': 'end_date',
                'Faculty': 'faculty_name',
                'No.': 'number_of_participants',
                'Remark': 'remark',
                'Status': 'status',
            }, inplace=True)

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Failed to load Excel file: {e}"))
            return

        def get_or_create_coordinator(faculty_name):
            if not faculty_name:
                return None

            name_parts = faculty_name.strip().split()
            first = name_parts[0] if len(name_parts) > 0 else ''
            middle = " ".join(name_parts[1:-1]) if len(name_parts) > 2 else ''
            last = name_parts[-1] if len(name_parts) > 1 else ''

            for u in User.objects.filter(is_coordinator=True):
                full = " ".join(filter(None, [u.first_name, u.middle_name, u.last_name])).strip().lower()
                if full == faculty_name.strip().lower():
                    return u

            ehrms_code = str(random.randint(900000, 999999))
            while User.objects.filter(ehrms_code=ehrms_code).exists():
                ehrms_code = str(random.randint(900000, 999999))

            dummy = User.objects.create(
                ehrms_code=ehrms_code,
                first_name=first,
                middle_name=middle,
                last_name=last,
                email=f"{ehrms_code}@irdt.in",
                mobile_number=f"9{random.randint(100000000, 999999999)}",
                is_coordinator=True,
            )
            dummy.set_password("Irdt@123")
            dummy.save()
            return dummy

        for i, row in df.iterrows():
            try:
                code = str(row.get("code", "")).strip()
                name = str(row.get("name", "")).strip()
                if not code or not name or pd.isna(row.get("start_date")) or pd.isna(row.get("end_date")):
                    self.stdout.write(self.style.WARNING(f"⚠️ Skipping row {i+2} due to missing required fields."))
                    continue

                start_date = pd.to_datetime(row["start_date"]).date()
                end_date = pd.to_datetime(row["end_date"]).date()
                faculty_name = row.get("faculty_name", "").strip()
                faculty = get_or_create_coordinator(faculty_name)

                training, created = Training.objects.update_or_create(
                    code=code,
                    defaults={
                        'name': name,
                        'target_group': row.get("target_group", ""),
                        'venue': row.get("venue", ""),
                        'mode': row.get("mode", ""),
                        'training_type': row.get("training_type", ""),
                        'start_date': start_date,
                        'end_date': end_date,
                        'faculty': faculty,
                        'faculty_name': faculty_name,
                        'number_of_participants': int(row.get("number_of_participants") or 0),
                        'remark': row.get("remark", ""),
                        'status': row.get("status", "")
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"🆕 Added training: {code}"))
                else:
                    self.stdout.write(self.style.NOTICE(f"🔁 Updated training: {code}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error on row {i+2} ({code}): {e}"))
