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
from .models import Enrollment
from .serializers import EnrollmentSerializer
from Login.models import User

class EnrollTrainingView(generics.CreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        ehrms_code = self.request.data.get("trainee")  # 🔄 changed from "ehrms_code"
        if not ehrms_code:
            raise serializers.ValidationError({"trainee": "This field is required."})

        try:
            trainee = User.objects.get(ehrms_code=ehrms_code)
        except User.DoesNotExist:
            raise serializers.ValidationError({"trainee": "Trainee with this EHRMS code does not exist."})

        serializer.save(trainee=trainee)

class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(trainee__ehrms_code=self.request.user.ehrms_code)
