from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from Certificate.utils.generator import generate_certificates_from_excel
from Certificate.permissions import IsCoordinator
from Login.authentication import CookieJWTAuthentication
from django.http import FileResponse, Http404
from Certificate.models import Certificate
from django.views.static import serve
from django.utils.decorators import method_decorator
from Certificate.serializers import CertificateSerializer
from Training.models import TrainingProgram
from io import BytesIO
from django.http import HttpResponse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.utils.encoding import smart_str
from django.contrib.auth.models import Group
from django.conf import settings
import tempfile
import os
import zipfile
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt

class CertificateGenerateView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, IsCoordinator]
    parser_classes = [MultiPartParser]

    def post(self, request, training_code):
        uploaded_file = request.FILES.get('file')              # Excel (trainee data)
        template_file = request.FILES.get('template')  
        if uploaded_file and not uploaded_file.name.endswith(('.xlsx', '.xls')):
            return Response({'error': 'Only Excel files (.xlsx or .xls) are allowed.'}, status=400)        # .docx template

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
            generated_certificates,zip_file_path = generate_certificates_from_excel(
                file_path=temp_file_path,
                template_path=template_path,
                training_code=training_code,
                coordinator_user=request.user
            )
            # Preview and ZIP URLs
            preview_urls = [
            request.build_absolute_uri(cert.certificate_file.url)
            for cert in generated_certificates
            if cert.certificate_file
            ]

            zip_url = request.build_absolute_uri(
            os.path.join(settings.MEDIA_URL, os.path.basename(zip_file_path))
            )    if zip_file_path else None

            return Response({
            'message': f"{len(generated_certificates)} certificates generated and uploaded successfully.",
            'certificates': CertificateSerializer(generated_certificates, many=True).data,
            'preview_urls': preview_urls,
            'zip_url': zip_url
            }, status=200)


           

        except Exception as e:
            print(f"❌ Error during certificate generation: {e}")
            return Response({'error': 'Internal server error while generating certificates.'}, status=500)

        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            if template_path and os.path.exists(template_path):
                os.remove(template_path)



@method_decorator(xframe_options_exempt, name='dispatch')
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
    
    
@method_decorator(xframe_options_exempt, name='dispatch')
class CertificatePreviewView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, IsCoordinator]

    def get(self, request, cert_id):
        try:
            cert = Certificate.objects.get(id=cert_id)
            if cert and cert.certificate_file:
                file_path = cert.certificate_file.path
                return FileResponse(
                    open(file_path, 'rb'),
                    content_type='application/pdf',
                )
            raise Http404("Certificate not found.")
        except Certificate.DoesNotExist:
            raise Http404("Invalid certificate ID.")
        
# class CertificateDownloadZipView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, training_code):
#         try:
#             training = TrainingProgram.objects.get(code=training_code)
#         except TrainingProgram.DoesNotExist:
#             raise Http404("Training not found.")

#         certificates = Certificate.objects.filter(training=training)

#         if not certificates.exists():
#             return HttpResponse("No certificates found for this training.", status=404)

#         # Create in-memory zip file
#         zip_buffer = BytesIO()
#         with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
#             for cert in certificates:
#                 if cert.certificate_file and os.path.isfile(cert.certificate_file.path):
#                     cert_name = os.path.basename(cert.certificate_file.path)
#                     zip_file.write(cert.certificate_file.path, arcname=cert_name)

#         zip_buffer.seek(0)
#         response = HttpResponse(zip_buffer, content_type='application/zip')
#         response['Content-Disposition'] = f'attachment; filename=certificates_{training.code}.zip'
#         return response

from django.http import HttpResponse

class CertificateDownloadZipView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated, IsCoordinator]

    def get(self, request, training_code):
        try:
            training = TrainingProgram.objects.get(code=training_code)
        except TrainingProgram.DoesNotExist:
            raise Http404("Training not found")

        certificates = Certificate.objects.filter(training=training, certificate_file__isnull=False)

        if not certificates.exists():
            raise Http404("No certificates found for this training")

        with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as tmp_zip:
            zip_path = tmp_zip.name

        try:
            # Create the ZIP file
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for cert in certificates:
                    cert_path = cert.certificate_file.path
                    if os.path.exists(cert_path):
                        arcname = os.path.basename(cert_path)
                        zipf.write(cert_path, arcname=arcname)

            # Read the ZIP into memory
            with open(zip_path, 'rb') as f:
                zip_data = f.read()

            # Prepare response after closing the file
            response = HttpResponse(zip_data, content_type='application/zip')
            response['Content-Disposition'] = f'attachment; filename="certificates_{training_code}.zip"'
            return response

        finally:
            # Now it's safe to delete on Windows
            if os.path.exists(zip_path):
                os.remove(zip_path)
