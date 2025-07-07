import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import TrainingForm from "../components/TrainingForm";

const ManageTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/training/training-programs/");
      setTrainings(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 403) {
        toast.error("Unauthorized. Please login again.");
      } else {
        toast.error("Failed to load trainings.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this training?")) return;
    try {
      await axiosInstance.delete(`training-programs/${id}/`);
      toast.success("Training deleted successfully.");
      fetchTrainings();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete training.");
    }
  };

  const handleEdit = (training) => {
    setSelectedTraining(training);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTraining(null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div className="p-4">
      <h2 className="mb-3 text-center">Admin - Manage Trainings</h2>
      <Button variant="primary" className="mb-3" onClick={handleAdd}>
        + Add Training
      </Button>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : trainings.length === 0 ? (
        <p>No training programs found.</p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th style={{ width: "6%", whiteSpace: "nowrap" }}>Code</th>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "12%" }}>Venue</th>
                <th style={{ width: "8%" }}>Mode</th>
                <th style={{ width: "10%" }}>Type</th>
                <th style={{ width: "10%" }}>Start Date</th>
                <th style={{ width: "10%" }}>End Date</th>
                <th style={{ width: "10%" }}>Faculty</th>
                <th style={{ width: "8%", whiteSpace: "nowrap" }}># Participants</th>
                <th style={{ width: "12%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((t) => (
                <tr key={t.id} className="text-center">
                  <td>{t.code || "-"}</td>
                  <td className="text-start">{t.name}</td>
                  <td>{t.venue || "-"}</td>
                  <td>{t.mode || "-"}</td>
                  <td>{t.training_type || "-"}</td>
                  <td>{t.start_date}</td>
                  <td>{t.end_date}</td>
                  <td>{t.faculty || "-"}</td>
                  <td>{t.number_of_participants ?? "-"}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTraining ? "Edit Training" : "Add Training"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TrainingForm
            training={selectedTraining}
            onSuccess={() => {
              setShowModal(false);
              fetchTrainings();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageTrainings;
