from rest_framework import serializers
from django.utils.timezone import now
from .models import TrainingProgram, TeachingStaff


class TrainingProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = [
            'id',
            'code',
            'name',
            'target_group',
            'venue',
            'mode',
            'training_type',
            'start_date',
            'end_date',
            'faculty',
            'number_of_participants',
            'remark',
            'status',       # Read-only
            'coordinator',  # Optional: expose coordinator
        ]
        read_only_fields = ['status', 'coordinator']

    def validate_number_of_participants(self, value):
        if value is not None and (value < 0 or value > 1000):
            raise serializers.ValidationError("Participant count must be between 0 and 1000.")
        return value

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError({
                    "end_date": "End date cannot be earlier than start date."
                })
            if start_date < now().date():
                raise serializers.ValidationError({
                    "start_date": "Start date cannot be in the past."
                })

        return data


class TeachingStaffSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = TeachingStaff
        fields = ['id', 'name', 'branch', 'experience', 'user_email']
