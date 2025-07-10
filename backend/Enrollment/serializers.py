# from rest_framework import serializers
# from .models import Enrollment
# from Training.models import TrainingProgram
# from Login.models import User

# class EnrollmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Enrollment
#         fields = ['trainee', 'training']  # or '__all__' if needed

#     def create(self, validated_data):
#         # Remove ehrms_code if it exists in validated_data
#         validated_data.pop('ehrms_code', None)
#         return super().create(validated_data)

#     def validate_trainee(self, value):
#         if isinstance(value, str):
#             try:
#                 return User.objects.get(ehrms_code=value)
#             except User.DoesNotExist:
#                 raise serializers.ValidationError("Trainee with this EHRMS code does not exist.")
#         return value

#     def validate_training(self, value):
#         if isinstance(value, str):
#             try:
#                 return TrainingProgram.objects.get(code=value)
#             except TrainingProgram.DoesNotExist:
#                 raise serializers.ValidationError("Training program does not exist.")
#         return value




from rest_framework import serializers
from .models import Enrollment
from Training.models import TrainingProgram

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['trainee', 'training']
        extra_kwargs = {
            'trainee': {'read_only': True}  # will be set from view
        }

    def validate_training(self, value):
        if isinstance(value, str):
            try:
                return TrainingProgram.objects.get(code=value)
            except TrainingProgram.DoesNotExist:
                raise serializers.ValidationError("Training program not found.")
        return value
