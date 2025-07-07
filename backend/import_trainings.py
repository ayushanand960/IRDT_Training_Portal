import pandas as pd
from datetime import datetime
import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from Training.models import TrainingProgram

from django.utils.timezone import make_aware

# Load Excel file
file_path = "Training Calendar 2025-26 Final.xlsx"
df = pd.read_excel(file_path, sheet_name="Training Calendar 2025-26")

# Clean the data
df = df.dropna(subset=["Code", "Name of Programme"])

# Rename columns to match model fields
df = df.rename(columns={
    "Code": "code",
    "Name of Programme": "name",
    "Target Group": "target_group",
    "Venue": "venue",
    "Mode": "mode",
    "Training Type": "training_type",
    "Start Date": "start_date",
    "End Date": "end_date",
    "Faculy": "faculty",
    "No.": "number_of_participants",
    "Remark": "remark",
    "Status": "status"
})

# Import data into the database
for _, row in df.iterrows():
    try:
        start_date = pd.to_datetime(row['start_date'], errors='coerce')
        end_date = pd.to_datetime(row['end_date'], errors='coerce')

        number = int(row['number_of_participants']) if not pd.isna(row['number_of_participants']) else None

        TrainingProgram.objects.create(
            code=row['code'],
            name=row['name'],
            target_group=row['target_group'],
            venue=row['venue'],
            mode=row['mode'],
            training_type=row['training_type'],
            start_date=start_date.date() if not pd.isna(start_date) else None,
            end_date=end_date.date() if not pd.isna(end_date) else None,
            faculty=row['faculty'],
            number_of_participants=number,
            remark=row['remark'],
            status=row['status']
        )

        print(f"✅ Imported: {row['code']} - {row['name']}")
    except Exception as e:
        print(f"❌ Error on {row.get('code')}: {e}")
