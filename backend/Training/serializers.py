from rest_framework import serializers
from .models import TrainingProgram
from Login.models import User
from django.utils.timezone import now

class TrainingProgramSerializer(serializers.ModelSerializer):
    faculty_name_display = serializers.SerializerMethodField()

    class Meta:
        model = TrainingProgram
        fields = [
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
            'target_group',
            'remark',
            'faculty_name_display',
        ]
        read_only_fields = ['status']

    def get_faculty_name_display(self, obj):
        if obj.faculty:
            return f"{obj.faculty.first_name} {obj.faculty.middle_name or ''} {obj.faculty.last_name}".strip()
        return "-"

    def validate_faculty(self, value):
        if isinstance(value, str):
            try:
                return User.objects.get(ehrms_code=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid faculty ehrms_code.")
        return value

    def validate_code(self, value):
        request = self.context.get('request')
        if request:
            method = request.method
            if method == 'POST':
                if TrainingProgram.objects.filter(code=value).exists():
                    raise serializers.ValidationError("Training Program with this Code already exists.")
            elif method in ['PUT', 'PATCH']:
                instance = self.instance
                if instance and instance.code != value:
                    if TrainingProgram.objects.filter(code=value).exists():
                        raise serializers.ValidationError("Training Program with this Code already exists.")
        return value

    def validate_number_of_participants(self, value):
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

    def create(self, validated_data):
        faculty = validated_data.get('faculty')
        if faculty:
            validated_data['faculty_name'] = (
                f"{faculty.first_name} {faculty.middle_name or ''} {faculty.last_name}".strip()
            )
        return super().create(validated_data)

    def update(self, instance, validated_data):
        faculty = validated_data.get('faculty', instance.faculty)
        if faculty:
            validated_data['faculty_name'] = (
                f"{faculty.first_name} {faculty.middle_name or ''} {faculty.last_name}".strip()
            )
        return super().update(instance, validated_data)

#------------------------------------------------------------------------------------------------------
from .models import Nomination
from datetime import timedelta
from Enrollment.models import Enrollment

class NominationSerializer(serializers.ModelSerializer):
    trainee = serializers.SlugRelatedField(
        slug_field='ehrms_code',
        queryset=User.objects.filter(is_coordinator=False)
    )
    training = serializers.SlugRelatedField(
        slug_field='code',
        queryset=TrainingProgram.objects.all()
    )

    class Meta:
        model = Nomination
        fields = ['trainee', 'training', 'nominated_by', 'created_at']
        read_only_fields = ['nominated_by', 'created_at']

    def validate(self, data):
        trainee = data.get('trainee')
        training = data.get('training')

        if not trainee or not training:
            return data

        start_date = training.start_date
        end_date = training.end_date

        # Exclude current instance (for update case)
        nomination_qs = Nomination.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date
        )
        if self.instance:
            nomination_qs = nomination_qs.exclude(pk=self.instance.pk)

        # Check overlapping enrollments
        enrollment_qs = Enrollment.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date
        )

        if nomination_qs.exists() or enrollment_qs.exists():
            raise serializers.ValidationError({
                "trainee": "This trainee is already nominated or enrolled in another training."
            })

        return data

    def create(self, validated_data):
        validated_data['nominated_by'] = self.context['request'].user
        return super().create(validated_data)


from .models import Rejection

class RejectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rejection
        fields = ['trainee', 'training', 'rejected_by', 'reason', 'created_at']
        read_only_fields = ['rejected_by', 'created_at']
