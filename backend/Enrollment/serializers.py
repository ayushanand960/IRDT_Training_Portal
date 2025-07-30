# from rest_framework import serializers
# from .models import Enrollment
# from Training.models import TrainingProgram
# from Training.models import Nomination  # import this to check overlapping nominations

# class EnrollmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Enrollment
#         fields = ['trainee', 'training']
#         extra_kwargs = {
#             'trainee': {'read_only': True}
#         }

#     def validate_training(self, value):
#         if isinstance(value, str):
#             try:
#                 return TrainingProgram.objects.get(code=value)
#             except TrainingProgram.DoesNotExist:
#                 raise serializers.ValidationError("Training program not found.")
#         return value

#     def validate(self, data):
#         trainee = self.context['request'].user
#         new_training = data.get('training')

#         if not trainee or not new_training:
#             return data

#         start_date = new_training.start_date
#         end_date = new_training.end_date

#         # 1. Check overlapping Enrollments
#         from .models import Enrollment
#         overlapping_enrollments = Enrollment.objects.filter(
#             trainee=trainee,
#             training__start_date__lte=end_date,
#             training__end_date__gte=start_date
#         )

#         # 2. Check overlapping Nominations
#         from Training.models import Nomination
#         overlapping_nominations = Nomination.objects.filter(
#             trainee=trainee,
#             training__start_date__lte=end_date,
#             training__end_date__gte=start_date
#         )

#         if overlapping_enrollments.exists() or overlapping_nominations.exists():
#             raise serializers.ValidationError("You are already enrolled or nominated for another training during this period.")

#         return data




from rest_framework import serializers
from .models import Enrollment
from Training.models import TrainingProgram, Nomination
from datetime import timedelta
from django.utils import timezone

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['trainee', 'training']
        extra_kwargs = {
            'trainee': {'read_only': True}
        }

    def validate_training(self, value):
        # If training is passed as code string
        if isinstance(value, str):
            try:
                return TrainingProgram.objects.get(code=value)
            except TrainingProgram.DoesNotExist:
                raise serializers.ValidationError("Training program not found.")
        return value

    def validate(self, data):
        trainee = self.context['request'].user
        training = data.get('training')

        if not trainee or not training:
            return data  # Skip validation if incomplete data

        today = timezone.now().date()
        two_months_ago = today - timedelta(days=60)
        two_years_ago = today - timedelta(days=730)

        start_date = training.start_date
        end_date = training.end_date

        # ✅ Rule 1: Attended training in last 2 months
        recent_attended = Enrollment.objects.filter(
            trainee=trainee,
            training__end_date__gte=two_months_ago,
            status='attended'
        ).exists()
        if recent_attended:
            raise serializers.ValidationError("❌ You have attended a training in the last 2 months.")

        # ✅ Rule 2: Same training code attended in last 2 years
        same_code_attended = Enrollment.objects.filter(
            trainee=trainee,
            training__code=training.code,
            training__end_date__gte=two_years_ago,
            status='attended'
        ).exists()
        if same_code_attended:
            raise serializers.ValidationError("❌ You have already attended this training in the last 2 years.")

        # ✅ Rule 3: Already nominated for upcoming training
        upcoming_nominated = Enrollment.objects.filter(
            trainee=trainee,
            training__start_date__gte=today,
            status='nominated'
        ).exists()
        if upcoming_nominated:
            raise serializers.ValidationError("❌ You are already nominated for an upcoming training.")

        # ✅ Rule 4: Overlapping training enrollments
        overlapping_enrollments = Enrollment.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date,
        ).exclude(status='rejected')

        # ✅ Rule 4b: Overlapping nominations
        overlapping_nominations = Nomination.objects.filter(
            trainee=trainee,
            training__start_date__lte=end_date,
            training__end_date__gte=start_date
        )

        if overlapping_enrollments.exists() or overlapping_nominations.exists():
            raise serializers.ValidationError("❌ You are already enrolled or nominated for another training during this period.")

        return data
