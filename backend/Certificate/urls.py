from django.urls import path
from Certificate.views import CertificateGenerateView, CertificateDownloadView, TraineeCertificateListView 

app_name = 'certificate'  

urlpatterns = [
    path('generate/<str:training_code>/', CertificateGenerateView.as_view(), name='generate-certificate'),
    path('download/<str:training_code>/', CertificateDownloadView.as_view(), name='download-certificate'),
        path('my-certificates/', TraineeCertificateListView.as_view(), name='my-certificates'), 
]
