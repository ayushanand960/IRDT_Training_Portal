import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Table, Button, Spinner, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminNominationDashboard = () => {
    const [finalizedTrainings, setFinalizedTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFinalizedTrainings = async () => {
        try {
            const res = await axiosInstance.get("/training/finalized-nominations/");
            setFinalizedTrainings(res.data);
        } catch (err) {
            toast.error("Failed to fetch finalized nominations");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (trainingCode) => {
        try {
            const encodedCode = encodeURIComponent(trainingCode.trim());
            const response = await axiosInstance.get(
                `/training/download-final-nominations/${encodedCode}/`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `FinalNominations_${trainingCode}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            toast.error("Failed to download XLSX");
            console.error(err);
        }
    };

    const handleApproveEdit = async (trainingCode) => {
        try {
            await axiosInstance.post(`/training/approve-edit/${trainingCode}/`, {
            action: "approve" // ✅ Send in request body
        });
            toast.success("Edit access approved.");
            fetchFinalizedTrainings(); // 🔁 refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to approve access.");
        }
    };

    const handleRejectEdit = async (trainingCode) => {
        try {
            await axiosInstance.post(`/training/approve-edit/${trainingCode}/`, {
            action: "reject" // ✅ Send in request body
        });
            toast.success("Edit access rejected.");
            fetchFinalizedTrainings(); // 🔁 refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to reject access.");
        }
    };




    useEffect(() => {
        fetchFinalizedTrainings();
    }, []);

    if (loading)
        return (
            <Spinner animation="border" role="status" className="mt-5 d-block mx-auto" />
        );

    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <h4 className="mb-4 text-primary">📋 Finalized Nomination Lists</h4>
                    {finalizedTrainings.length === 0 ? (
                        <p>No finalized nominations submitted yet.</p>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Training Code</th>
                                    <th>Name</th>
                                    <th>Coordinator</th>
                                    <th>Finalized On</th>
                                    <th>Download</th>
                                    <th>Edit Access Request</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finalizedTrainings.map((training) => (
                                    <tr key={training.code}>
                                        <td>{training.code}</td>
                                        <td>{training.name}</td>
                                        <td>{training.faculty || "N/A"}</td>
                                        <td>{training.finalized_at?.slice(0, 10) || "—"}</td>
                                        <td>
                                            {training.is_completed ? (
                                                <span className="text-success fw-bold">✅ Completed</span>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleDownload(training.code)}
                                                >
                                                    ⬇️ XLSX
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            {training.edit_request_status === "pending" ? (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleApproveEdit(training.code)}
                                                    >
                                                        ✅ Approve
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRejectEdit(training.code)}
                                                    >
                                                        ❌ Reject
                                                    </Button>
                                                </>
                                            ) : training.edit_request_status === "approved" ? (
                                                <span className="text-success fw-bold">Approved</span>
                                            ) : training.edit_request_status === "rejected" ? (
                                                <span className="text-danger fw-bold">Rejected</span>
                                            ) : (
                                                <span className="text-muted">No Request</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminNominationDashboard;
