from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Certificate
from .serializers import CertificateSerializer

class CertificateListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        certificates = Certificate.objects.filter(user=request.user)
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CertificateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Set user here
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CertificateDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Certificate.objects.get(pk=pk, user=self.request.user)
        except Certificate.DoesNotExist:
            return None

    def get(self, request, pk):
        cert = self.get_object(pk)
        if not cert:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CertificateSerializer(cert)
        return Response(serializer.data)

    def put(self, request, pk):
        cert = self.get_object(pk)
        if not cert:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CertificateSerializer(cert, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Again, assign user if needed
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        cert = self.get_object(pk)
        if not cert:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        cert.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
