from rest_framework import serializers
from .models import Training


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = [
            'code',
            'name',
            'target_group',
            'venue',
            'mode',
            'training_type',
            'start_date',
            'end_date',
            'faculty_name',
            'number_of_participants',
            'remark',
            'status',
        ]
