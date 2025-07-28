import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import CertificateCard from '../components/CertificateCard'; // ✅ use the card you made

const TraineeDashboard = () => {
  const [assignedTrainings, setAssignedTrainings] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchAssignedTrainings();
    fetchCertificates(); // ✅
  }, []);

  const fetchAssignedTrainings = async () => {
    try {
      const res = await axiosInstance.get('/trainings/assigned/');
      setAssignedTrainings(res.data);
    } catch (err) {
      toast.error("Failed to load assigned trainings");
    }
  };

  const fetchCertificates = async () => {
    try {
      const res = await axiosInstance.get('/certificate/list/');
      setCertificates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadCertificate = async (trainingCode) => {
    try {
      const response = await axiosInstance.get(`/certificate/download/${trainingCode}/`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${trainingCode}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Download failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Trainee Dashboard</h2>
      <h4>Your Trainings</h4>

      {assignedTrainings.map(training => {
        const cert = certificates.find(c => c.training_code === training.code); // ✅ check for certificate

        return (
          <CertificateCard
            key={training.code}
            title={training.name}
            subtitle={`Training at ${training.venue}`}
            showDownload={!!cert}
            onDownload={() => downloadCertificate(training.code)}
          />
        );
      })}
    </div>
  );
};

export default TraineeDashboard;
