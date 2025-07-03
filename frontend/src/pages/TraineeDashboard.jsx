// src/pages/TraineeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const TraineeDashboard = () => {
  const [assignedTrainings, setAssignedTrainings] = useState([]);

  const fetchAssignedTrainings = async () => {
    try {
      const res = await axiosInstance.get('/trainings/assigned/');
      setAssignedTrainings(res.data);
    } catch (err) {
      toast.error("Failed to load assigned trainings");
    }
  };

  useEffect(() => {
    fetchAssignedTrainings();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Trainee Dashboard</h2>
      <h4>Your Trainings</h4>
      <ul className="list-group">
        {assignedTrainings.map((training) => (
          <li key={training.id} className="list-group-item">
            <strong>{training.title}</strong><br />
            {training.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TraineeDashboard;
