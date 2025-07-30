# from rest_framework import generics, permissions, serializers
# from .models import Enrollment
# from .serializers import EnrollmentSerializer
# from Login.models import User

# class EnrollTrainingView(generics.CreateAPIView):
#     serializer_class = EnrollmentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         ehrms_code = self.request.data.get("ehrms_code")
#         if not ehrms_code:
#             raise serializers.ValidationError({"ehrms_code": "This field is required."})

#         try:
#             trainee = User.objects.get(ehrms_code=ehrms_code)
#         except User.DoesNotExist:
#             raise serializers.ValidationError({"ehrms_code": "Trainee with this EHRMS code does not exist."})

#         serializer.save(trainee=trainee)

# class MyEnrollmentsView(generics.ListAPIView):
#     serializer_class = EnrollmentSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Enrollment.objects.filter(trainee__ehrms_code=self.request.user.ehrms_code)


from rest_framework import generics, permissions, serializers
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from .models import Enrollment
from .serializers import EnrollmentSerializer
from Login.models import User
from Training.models import TrainingProgram



class EnrollTrainingView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ehrms_code = self.request.data.get("trainee")
        training_code = self.request.data.get("training")

        if not ehrms_code or not training_code:
            raise serializers.ValidationError({
                "trainee": "EHRMS code is required.",
                "training": "Training code is required."
            })

        try:
            trainee = User.objects.get(ehrms_code=ehrms_code)
        except User.DoesNotExist:
            raise serializers.ValidationError({"trainee": "Trainee not found."})

        try:
            training = TrainingProgram.objects.get(code=training_code)
        except TrainingProgram.DoesNotExist:
            raise serializers.ValidationError({"training": "Training not found."})

        today = timezone.now().date()
        two_months_ago = today - timedelta(days=60)
        two_years_ago = today - timedelta(days=730)

        # 1. Attended any training in last 2 months
        recent_attended = Enrollment.objects.filter(
            trainee=trainee,
            training__end_date__gte=two_months_ago,
            status='attended'
        ).exists()
        if recent_attended:
            raise ValidationError("❌ You have attended a training in the last 2 months.")

        # 2. Attended training in same target group in last 2 years
        same_group_attended = Enrollment.objects.filter(
            trainee=trainee,
            training__code=training.code,
            training__end_date__gte=two_years_ago,
            status='attended'
        ).exists()
        if same_group_attended:
            raise ValidationError("❌ You have already attended training in this target group within the last 2 years.")

        # 3. Already nominated for any upcoming training
        already_nominated = Enrollment.objects.filter(
            trainee=trainee,
            training__start_date__gte=today,
            status='nominated'
        ).exists()
        if already_nominated:
            raise ValidationError("❌ You are already nominated for an upcoming training.")

        # ✅ All checks passed
        serializer.save(trainee=trainee, training=training, status='applied')
class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(trainee__ehrms_code=self.request.user.ehrms_code)
