// src/components/UpcomingTrainings.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";

const UpcomingTrainings = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/trainings/training-programs");
        const now = dayjs();
        const cutoff = now.add(15, "day");

        const filtered = res.data.filter((training) => {
          const start = dayjs(training.start_date);
          return start.isAfter(now) && start.isBefore(cutoff);
        });

        setUpcoming(filtered);
      } catch (error) {
        console.error("Error fetching upcoming trainings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;

//   if (upcoming.length === 0) return <p>No upcoming trainings in next 15 days.</p>;

  return (
    <div className="mt-5">
      <h5 className="fw-bold text-dark mb-3">Upcoming Trainings (Next 15 Days)</h5>
      <Row className="g-4">
        {upcoming.map((training) => (
          <Col md={6} lg={4} key={training.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold text-primary">{training.target_group}</h6>
                <p><strong>Start:</strong> {training.start_date}</p>
                <p><strong>End:</strong> {training.end_date}</p>
                <p><strong>Venue:</strong> {training.venue}</p>
                <p><strong>Mode:</strong> {training.mode}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UpcomingTrainings;
