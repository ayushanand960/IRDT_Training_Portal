import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance'; // your JWT axios instance
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get('/login/user/profile/');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        navigate('/login'); // if token expired or unauthorized
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const fullName = `${user.first_name} ${user.middle_name || ''} ${user.last_name}`.trim();

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="text-center">Welcome, {user.first_name}!</h2>
        <p className="text-center mt-2">
          <strong>Full Name:</strong> {fullName}
        </p>
        <p className="text-center">
          <strong>EHRMS Code:</strong> {user.ehrms_code}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
