from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from Certificate.utils.generator import generate_certificates_from_excel
from Certificate.permissions import IsCoordinator
from Login.authentication import CookieJWTAuthentication
from django.http import FileResponse, Http404
from Certificate.models import Certificate
from Certificate.serializers import CertificateSerializer
from Training.models import TrainingProgram
from django.conf import settings
import tempfile
import os

class CertificateGenerateView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, IsCoordinator]
    parser_classes = [MultiPartParser]

    def post(self, request, training_code):
        uploaded_file = request.FILES.get('file')              # Excel (trainee data)
        template_file = request.FILES.get('template')          # .docx template

        if not uploaded_file or not template_file:
            return Response({'error': 'Both data file and template file are required.'}, status=400)

        temp_file_path = None
        template_path = None

        try:
            # Save Excel file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_file:
                for chunk in uploaded_file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name

            # Save template file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_template:
                for chunk in template_file.chunks():
                    temp_template.write(chunk)
                template_path = temp_template.name

            print(f"📁 Excel path: {temp_file_path}")
            print(f"📁 Template path: {template_path}")

            # Generate certificates
            generated_certificates = generate_certificates_from_excel(
                file_path=temp_file_path,
                template_path=template_path,
                training_code=training_code,
                coordinator_user=request.user
            )

            # Build preview URLs for frontend
            preview_urls = [
                request.build_absolute_uri(cert.certificate_file.url)
                for cert in generated_certificates
                if cert.certificate_file
            ]

            return Response({
                'message': f"{len(generated_certificates)} certificates generated and uploaded successfully.",
                'certificates': CertificateSerializer(generated_certificates, many=True).data,
                'preview_urls': preview_urls
            }, status=200)

        except Exception as e:
            print(f"❌ Error during certificate generation: {e}")
            return Response({'error': 'Internal server error while generating certificates.'}, status=500)

        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            if template_path and os.path.exists(template_path):
                os.remove(template_path)


class CertificateDownloadView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code)
            certificate = Certificate.objects.get(user=request.user, training=training)

            if certificate.certificate_file and certificate.certificate_file.name.endswith('.pdf'):
                file_path = certificate.certificate_file.path
                filename = os.path.basename(file_path)
                return FileResponse(
                    open(file_path, 'rb'),
                    content_type='application/pdf',
                    as_attachment=True,
                    filename=filename
                )
            else:
                raise Http404("PDF certificate not found.")
        except (Certificate.DoesNotExist, TrainingProgram.DoesNotExist):
            raise Http404("Certificate not available for this training.")


class TraineeCertificateListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        certificates = Certificate.objects.filter(user=user)
        serializer = CertificateSerializer(certificates, many=True, context={'request': request})
        return Response(serializer.data, status=200)
