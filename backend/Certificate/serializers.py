# from rest_framework import serializers
# from .models import Certificate

# class CertificateSerializer(serializers.ModelSerializer):
#     training_name = serializers.CharField(source='training.name')

#     class Meta:
#         model = Certificate
#         fields = [
#             'id',
#             'training_name',
#             'certificate_file',
#             'full_name',
#             'designation',
#             'institution',
#             'reference_number',
#             'issued_date',
#         ]


from rest_framework import serializers
from .models import Certificate
from Training.models import TrainingProgram

class TrainingProgramMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingProgram
        fields = ['code', 'name', 'start_date', 'end_date']

class CertificateSerializer(serializers.ModelSerializer):
    training = TrainingProgramMiniSerializer(read_only=True)
    certificate_file = serializers.SerializerMethodField()  # <-- change this

    class Meta:
        model = Certificate
        fields = [
            'id',
            'training',
            'certificate_file',       # now full URL
            'full_name',
            'designation',
            'institution',
            'reference_number',
            'issued_date',
        ]

    def get_certificate_file(self, obj):
        request = self.context.get('request')
        if obj.certificate_file and request:
            return request.build_absolute_uri(obj.certificate_file.url)
        return None
