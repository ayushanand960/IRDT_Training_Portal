from rest_framework import serializers
from .models import Enrollment
from Training.models import TrainingProgram
from Training.models import Nomination  # import this to check overlapping nominations

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['trainee', 'training']
        extra_kwargs = {
            'trainee': {'read_only': True}
        }

    def validate_training(self, value):
        if isinstance(value, str):
            try:
                return TrainingProgram.objects.get(code=value)
            except TrainingProgram.DoesNotExist:
                raise serializers.ValidationError("Training program not found.")
        return value

    def validate(self, data):
        trainee = self.context['request'].user
        new_training = data.get('training')

        if not trainee or not new_training:
            return data

        start_date = new_training.start_date
        end_date = new_training.end_date

        # 1. Check overlapping Enrollments
        from .models import Enrollment
        overlapping_enrollments = Enrollment.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date
        )

        # 2. Check overlapping Nominations
        from Training.models import Nomination
        overlapping_nominations = Nomination.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date
        )

        if overlapping_enrollments.exists() or overlapping_nominations.exists():
            raise serializers.ValidationError("You are already enrolled or nominated for another training during this period.")

        return data
