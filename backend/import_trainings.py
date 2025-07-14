import os
import django
import pandas as pd
import random
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from Training.models import TrainingProgram
from Login.models import User  # Custom User model

# Load Excel
try:
    df = pd.read_excel('./Training Calendar 2025-26 Final.xlsx')

    # Rename columns for consistency with model fields
    df.rename(columns={
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
    print(f"❌ Failed to load Excel file: {e}")
    exit(1)

# Helper: Generate unique ehrms_code
def generate_unique_ehrms_code():
    while True:
        ehrms_code = str(random.randint(900000, 999999))
        if not User.objects.filter(ehrms_code=ehrms_code).exists():
            return ehrms_code

# Helper: Split full name
def split_full_name(full_name):
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0], "", ""
    elif len(parts) == 2:
        return parts[0], "", parts[1]
    else:
        return parts[0], " ".join(parts[1:-1]), parts[-1]

# Process rows
for index, row in df.iterrows():
    code = str(row.get("Code", "")).strip()
    name = str(row.get("name", "")).strip()
    faculty_name = str(row.get("faculty_name", "")).strip()
    start_date = row.get("start_date")
    end_date = row.get("end_date")

    # Skip invalid
    if not code or not name or pd.isna(start_date) or pd.isna(end_date):
        print(f"⚠️ Skipping row {index + 2}: Missing required data (code/name/start/end)")
        continue

    try:
        start_date = pd.to_datetime(start_date).date()
        end_date = pd.to_datetime(end_date).date()
    except Exception:
        print(f"⚠️ Skipping {code}: Invalid date format")
        continue

    print(f"📦 Processing: {code} - Faculty: {faculty_name}")

    # Find or create user
    user = None
    for u in User.objects.filter(is_coordinator=True):
        full = " ".join(filter(None, [u.first_name, u.middle_name, u.last_name])).strip()
        if full.lower() == faculty_name.lower():
            user = u
            break

    if not user:
        first, middle, last = split_full_name(faculty_name)
        ehrms_code = generate_unique_ehrms_code()
        user = User.objects.create(
            ehrms_code=ehrms_code,
            first_name=first,
            middle_name=middle,
            last_name=last,
            email=f"{ehrms_code}@irdt.in",
            mobile_number=f"9{random.randint(100000000, 999999999)}",
            is_coordinator=True,
            is_staff=False,
        )
        user.set_password("Irdt@123")  # Replace with secure random password
        user.save()
        print(f"👤 Created dummy coordinator: {faculty_name} ({ehrms_code})")
    else:
        print(f"✅ Coordinator found: {faculty_name}")

    # Create or update training
    try:
        training, created = TrainingProgram.objects.update_or_create(
            code=code,
            defaults={
                'name': name,
                'target_group': row.get('target_group', ''),
                'venue': row.get('venue', ''),
                'mode': row.get('mode', ''),
                'training_type': row.get('training_type', ''),
                'start_date': start_date,
                'end_date': end_date,
                'faculty': user,
                'faculty_name': faculty_name,
                'number_of_participants': int(row.get('number_of_participants') or 0),
                'remark': row.get('remark', ''),
                'status': row.get('status', ''),
            }
        )
        if created:
            print(f"🆕 Created new training for: {code}")
        else:
            print(f"🔄 Updated training: {code}")

    except Exception as e:
        print(f"❌ Error on {code}: {e}")
