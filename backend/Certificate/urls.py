from django.urls import path
from Certificate.views import CertificateGenerateView, CertificateDownloadView, TraineeCertificateListView , CertificatePreviewView , CertificateDownloadZipView

app_name = 'certificate'  

urlpatterns = [
    path('generate/<str:training_code>/', CertificateGenerateView.as_view(), name='generate-certificate'),
    path('download/<str:training_code>/', CertificateDownloadView.as_view(), name='download-certificate'),
    path('my-certificates/', TraineeCertificateListView.as_view(), name='my-certificates'),
    path('preview-certificates/<str:cert_id>/', CertificatePreviewView.as_view(), name='preview-certificate'),
    path('download-zip/<str:training_code>/', CertificateDownloadZipView.as_view(), name='download-certificates-zip')
]
