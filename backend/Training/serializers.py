from rest_framework import serializers
from .models import TrainingProgram
from django.utils.timezone import now

class TrainingProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = ['code',
        'name',
        'venue',
        'mode',
        'training_type',
        'start_date',
        'end_date',
        'faculty',
        'number_of_participants'],
        read_only_fields = ['status']  # Prevent external writes if needed

    def validate_number_of_paclrticipants(self, value):
        if value is not None and (value < 0 or value > 1000):
            raise serializers.ValidationError("Participant count must be between 0 and 1000.")
        return value

    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError("End date cannot be earlier than start date.")
            if start_date < now().date():
                raise serializers.ValidationError("Start date cannot be in the past.")
        return data
