
import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";
import dayjs from "dayjs";
import TrainingCard from "./TrainingCard"; //  Reusing your existing UI

const UpcomingTrainings = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/training/training-programs");
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

  return (
    <div className="mt-5">
      <div
        className="mb-4 py-2 px-3 bg-white rounded shadow-sm border-start border-4"
        style={{ borderColor: "#006666" }}
      >
        <h3 className="mb-0 fw-bold text-dark">
          📅 <span style={{ color: "#006666" }}>Upcoming Trainings</span> (Next
          15 Days)
        </h3>
      </div>

      <Row className="g-3">
        {upcoming.map((training) => (
          <Col md={6} lg={4} key={training.id}>
            <TrainingCard
              training={training}
              showEnrollButton={false} // No enroll button in this section
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UpcomingTrainings;
