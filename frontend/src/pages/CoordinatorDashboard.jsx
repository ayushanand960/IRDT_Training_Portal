// src/pages/CoordinatorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const CoordinatorDashboard = () => {
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({ title: '', description: '' });

  const fetchTrainings = async () => {
    try {
      const res = await axiosInstance.get('/trainings/');
      setTrainings(res.data);
    } catch (err) {
      toast.error("Failed to fetch training data");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/trainings/create/', newTraining);
      toast.success("Training assigned successfully");
      setNewTraining({ title: '', description: '' });
      fetchTrainings();
    } catch (err) {
      toast.error("Error assigning training");
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Coordinator Dashboard</h2>
      <form className="mb-4" onSubmit={handleAssign}>
        <input
          className="form-control mb-2"
          placeholder="Training Title"
          value={newTraining.title}
          onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
          required
        />
        <textarea
          className="form-control mb-2"
          placeholder="Training Description"
          value={newTraining.description}
          onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
          required
        />
        <button className="btn btn-primary">Assign Training</button>
      </form>

      <h4>Assigned Trainings</h4>
      <ul className="list-group">
        {trainings.map((t) => (
          <li key={t.id} className="list-group-item">
            <strong>{t.title}</strong>: {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoordinatorDashboard;
