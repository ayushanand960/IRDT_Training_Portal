import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Spinner, Alert, Container, Card, Table } from "react-bootstrap";

const UserTrainingsPage = () => {
  const { ehrms_code } = useParams();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        // ✅ Pass the ehrms_code so backend fetches that user's trainings
        const res = await axiosInstance.get(
          `/training/past-trainings/?ehrms_code=${ehrms_code}`
        );
        setTrainings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch past trainings for this user.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [ehrms_code]);

  if (loading)
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Card className="p-3 shadow-sm mb-4">
        <h4>Past Trainings of User: {ehrms_code}</h4>
        <Link to="/all-users" className="btn btn-secondary mb-3">
          ← Back to Users
        </Link>
        {trainings.length === 0 ? (
          <Alert variant="info">No past trainings found for this user.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Training Code</th>
                <th>Training Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((training, index) => (
                <tr key={training.training_code}>
                  <td>{index + 1}</td>
                  <td>{training.code}</td>
                  <td>{training.name}</td>
                  <td>{training.start_date}</td>
                  <td>{training.end_date}</td>
                  <td>{training.venue}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default UserTrainingsPage;