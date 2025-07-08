import pandas as pd
from datetime import datetime
from django.utils.timezone import make_aware
from Training.models import TrainingProgram
from django.core.exceptions import ValidationError

# Load Excel
file_path = "Training Calendar 2025-26 Final.xlsx"
df = pd.read_excel(file_path, sheet_name="Training Calendar 2025-26")

# Drop rows missing required fields
df = df.dropna(subset=["Code", "Name of Programme"])

# Rename columns
df = df.rename(columns={
    "Code": "code",
    "Name of Programme": "name",
    "Target Group": "target_group",
    "Venue": "venue",
    "Mode": "mode",
    "T/NT": "training_type",
    "Start Date": "start_date",
    "End Date": "end_date",
    "Faculy": "faculty",
    "No.": "number_of_participants",
    "Remark": "remark",
    "Status": "status"
})

success_count = 0
error_count = 0

for i, row in df.iterrows():
    try:
        start_date = pd.to_datetime(row['start_date'], errors='coerce')
        end_date = pd.to_datetime(row['end_date'], errors='coerce')

        if pd.notnull(start_date):
            start_date = make_aware(start_date).date()
        if pd.notnull(end_date):
            end_date = make_aware(end_date).date()

        number_of_participants = int(row['number_of_participants']) if pd.notna(row['number_of_participants']) else None

        training = TrainingProgram(
            code=row.get('code'),
            name=row.get('name'),
            target_group=row.get('target_group'),
            venue=row.get('venue'),
            mode=row.get('mode'),
            training_type=row.get('training_type'),
            start_date=start_date,
            end_date=end_date,
            faculty=row.get('faculty'),
            number_of_participants=number_of_participants,
            remark=row.get('remark'),
            status=row.get('status'),
        )

        training.full_clean()
        training.save()
        success_count += 1
        print(f"✅ Imported: {training.code} - {training.name}")

    except ValidationError as ve:
        print(f"❌ Validation error in row {i}: {ve}")
        error_count += 1
    except Exception as e:
        print(f"❌ Error importing row {i}: {e}")
        error_count += 1

print(f"\n📊 Import Summary: {success_count} Success, {error_count} Errors")
