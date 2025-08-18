// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Spinner,
//   Form,
//   Row,
//   Col,
// } from "react-bootstrap";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import TrainingForm from "../components/TrainingForm";
// import DashboardLayout from "../components/DashboardLayout";

// const ManageTrainings = () => {
//   const [trainings, setTrainings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedTraining, setSelectedTraining] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [uploadFile, setUploadFile] = useState(null);
//   const [sessionYear, setSessionYear] = useState("");
//   const [uploadDate, setUploadDate] = useState("");
//   const [deletingYear, setDeletingYear] = useState("");

//   const fetchTrainings = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/training/training-programs/");
//       setTrainings(res.data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       if (err.response?.status === 403) {
//         toast.error("Unauthorized. Please login again.");
//       } else {
//         toast.error("Failed to load trainings.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleDelete = async (code) => {
//   if (!window.confirm("Are you sure you want to delete this training?")) return;
//   try {
//     await axiosInstance.delete(`/training/training-programs/${code}/`);
//     toast.success("Training deleted successfully.");
//     fetchTrainings();
//   } catch (err) {
//     console.error("Delete error:", err);
//     toast.error("Failed to delete training.");
//   }
// };

// const handleEdit = (training) => {
//   setSelectedTraining(training);
//   setShowModal(true);
// };

// const handleAdd = () => {
//   setSelectedTraining(null);
//   setShowModal(true);
// };

//   const handleExcelUpload = async () => {
//   if (!uploadFile || !sessionYear || !uploadDate) {
//     toast.error("Please fill in all upload fields.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("file", uploadFile);
//   formData.append("session_year", sessionYear);
//   formData.append("upload_date", uploadDate);  // Must be YYYY-MM-DD

//   console.log("Uploading formData:", {
//     file: uploadFile.name,
//     sessionYear,
//     uploadDate
//   });

//   try {
//     const res = await axiosInstance.post(
//       `/training/upload-excel/`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     toast.success(`${res.data.message}`);
//     fetchTrainings();
//   } catch (err) {
//     console.error("Upload error:", err.response?.data || err.message);
//     toast.error("Failed to upload trainings.");
//   }
// };

//   const handleBatchDelete = async () => {
//   if (!deletingYear) {
//     toast.error("Please select session year to delete.");
//     return;
//   }

//   if (!window.confirm(`Are you sure you want to delete batch ${deletingYear}?`)) return;

//   try {
//     await axiosInstance.post("/training/delete-batch/", {
//        session_year: deletingYear 
//     });

//     toast.success("Training batch deleted.");
//     fetchTrainings();
//   } catch (err) {
//     console.error("Batch delete error:", err);
//     toast.error("Failed to delete training batch.");
//   }
//   };


//   useEffect(() => {
//     fetchTrainings();
//   }, []);

//   return (
//     <DashboardLayout>
//       <div className="p-4">
//         <h2 className="mb-3 text-center">Admin - Manage Trainings</h2>

//         {/* Upload Excel Form */}
//         <div className="mb-4 border rounded p-3">
//           <h5>Upload Trainings (Excel)</h5>
//           <Row className="mb-2">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Session Year (e.g. 2026-27)</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="2026-27"
//                   value={sessionYear}
//                   onChange={(e) => setSessionYear(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Upload Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={uploadDate}
//                   onChange={(e) => setUploadDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Excel File</Form.Label>
//                 <Form.Control
//                   type="file"
//                   accept=".xlsx, .xls"
//                   onChange={(e) => setUploadFile(e.target.files[0])}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Button onClick={handleExcelUpload} variant="success">
//             Upload
//           </Button>
//         </div>

//         {/* Delete Training Batch */}
//         <div className="mb-4 border rounded p-3">
//           <h5>Delete Training Batch</h5>
//           <Row className="align-items-end">
//             <Col md={4}>
//               <Form.Group>
//                 <Form.Label>Session Year to Delete</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="2026-27"
//                   value={deletingYear}
//                   onChange={(e) => setDeletingYear(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md="auto">
//               <Button variant="danger" onClick={handleBatchDelete}>
//                 Delete Batch
//               </Button>
//             </Col>
//           </Row>
//         </div>

//         <Button variant="primary" className="mb-3" onClick={handleAdd}>
//           + Add Training
//         </Button>

//         {loading ? (
//           <div className="text-center">
//             <Spinner animation="border" />
//           </div>
//         ) : trainings.length === 0 ? (
//           <p>No training programs found.</p>
//         ) : (
//           <div className="table-responsive">
//             <Table striped bordered hover responsive className="align-middle">
//               <thead className="table-dark text-center">
//                 <tr>
//                   <th style={{ width: "6%", whiteSpace: "nowrap" }}>Code</th>
//                   <th style={{ width: "20%" }}>Name</th>
//                   <th style={{ width: "12%" }}>Venue</th>
//                   <th style={{ width: "8%" }}>Mode</th>
//                   <th style={{ width: "8%" }}>Type</th>
//                   <th style={{ width: "10%" }}>Start Date</th>
//                   <th style={{ width: "10%" }}>End Date</th>
//                   <th style={{ width: "15%" }}>Faculty</th>
//                   <th style={{ width: "8%", whiteSpace: "nowrap" }}># Participants</th>
//                   <th style={{ width: "12%" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {trainings.map((t) => (
//                   <tr key={t.id} className="text-center">
// <td>{t.code || "-"}</td>
// <td className="text-start">{t.name}</td>
// <td>{t.venue || "-"}</td>
// <td>{t.mode || "-"}</td>
// <td>{t.training_type || "-"}</td>
// <td>{t.start_date}</td>
// <td>{t.end_date}</td>
// <td>{t.faculty_name_display || "-"}</td>
// <td>{t.number_of_participants ?? "-"}</td>
// <td>
//   <div className="d-flex justify-content-center gap-1">
//     <Button
//       size="sm"
//       variant="secondary"
//       onClick={() => handleEdit(t)}
//     >
//       Edit
//     </Button>
//     <Button
//       size="sm"
//       variant="danger"
//       onClick={() => handleDelete(t.code)}
//     >
//       Delete
//     </Button>
//   </div>
// </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         )}

// {/* Modal for Add/Edit */}
// <Modal show={showModal} onHide={() => setShowModal(false)}>
//   <Modal.Header closeButton>
//     <Modal.Title>
//       {selectedTraining ? "Edit Training" : "Add Training"}
//     </Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     <TrainingForm
//       training={selectedTraining}
//       onSuccess={() => {
//         setShowModal(false);
//         fetchTrainings();
//       }}
//     />
//   </Modal.Body>
// </Modal>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ManageTrainings;





import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import TrainingForm from "../components/TrainingForm";

const ManageTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadDate, setUploadDate] = useState("");
  const [sessionYear, setSessionYear] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/training/training-programs/");
      setTrainings(response.data);
    } catch (error) {
      toast.error("Error fetching trainings");
    }
    setLoading(false);
  };

  const handleDelete = async (code) => {
    // if (!window.confirm("Are you sure you want to delete this training?")) return;
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/training/training-programs/${code}/`);
      toast.success("Training deleted successfully.");
      fetchTrainings();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete training.");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
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

  const groupTrainingsByBatch = (trainings) => {
    const groups = {};
    trainings.forEach((training) => {
      const uploadId = training.upload_id || "unknown";
      const batchDisplayName = training.batch_display_name || uploadId;

      if (!groups[uploadId]) {
        groups[uploadId] = {
          batchDisplayName,
          trainings: [],
        };
      }
      groups[uploadId].trainings.push(training);
    });

    // Sort uploadIds by sessionYear and uploadId descending
    const sortedUploadIds = Object.keys(groups).sort((a, b) => {
      const aYear = groups[a].trainings[0]?.session_year || "";
      const bYear = groups[b].trainings[0]?.session_year || "";

      if (aYear < bYear) return 1;
      if (aYear > bYear) return -1;
      return b < a ? -1 : 1;
    });

    return sortedUploadIds.map((uploadId) => ({
      uploadId,
      ...groups[uploadId],
    }));
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!excelFile || !uploadDate || !sessionYear) {
      toast.warning("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("upload_date", uploadDate);
    formData.append("session_year", sessionYear);

    try {
      await axiosInstance.post("/training/upload-excel/", formData);
      toast.success("Trainings uploaded successfully.");
      setExcelFile(null);
      setUploadDate("");
      setSessionYear("");
      fetchTrainings();
    } catch (error) {
      toast.error("Upload failed. Please check your Excel format.");
    }
  };

  const handleConfirmDelete = (batch) => {
    setBatchToDelete(batch);
    setShowConfirm(true);
  };

  const handleDeleteBatch = async () => {
    try {
      await axiosInstance.delete(`/training/delete-batch/${batchToDelete}/`);
      toast.success("Batch deleted successfully.");
      fetchTrainings();
    } catch (error) {
      toast.error("Batch deletion failed.");
    } finally {
      setShowConfirm(false);
      setBatchToDelete(null);
    }
  };

  const groupedTrainings = groupTrainingsByBatch(trainings);
  // put this above return()
  const formatDate = (val) => {
    if (!val) return "";
    // If it's a plain "YYYY-MM-DD" string, just reorder (safe, no timezone shifts)
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
    if (m) {
      const [, y, mo, d] = m;
      return `${d}/${mo}/${y}`; // 👉 dd/MM/yyyy
    }
    // Fallback for any other format
    const dt = new Date(val);
    return isNaN(dt) ? val : dt.toLocaleDateString("en-GB"); // dd/MM/yyyy
  };

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h2>Manage Trainings</h2>

        <Row className="align-items-end">
          <Col md={2}>
            <Form.Group controlId="formUploadDate">
              <Form.Label>Upload Date</Form.Label>
              <Form.Control
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="formSessionYear">
              <Form.Label>Session Year</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 2025-26"
                value={sessionYear}
                onChange={(e) => setSessionYear(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="formExcelFile">
              <Form.Label>Excel File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button className="w-100" onClick={handleUpload}>
              Upload Training Batch
            </Button>
          </Col>
          <Col md={2}>
            <Button variant="primary" className="w-100" onClick={handleAdd}>
              + Add Training
            </Button>
          </Col>
        </Row>

        <div className="mt-4">
          {loading ? (
            <Spinner animation="border" />
          ) : (
            groupedTrainings.map(({ uploadId, batchDisplayName, trainings }) => (
              <div key={uploadId} className="mb-4 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Full ID: {uploadId}</Tooltip>}
                  >
                    <h5 className="mb-2">Batch: {batchDisplayName}</h5>
                  </OverlayTrigger>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleConfirmDelete(uploadId)}
                  >
                    Delete Batch
                  </Button>
                </div>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {/* <th>Code</th>
                      <th>Program Name</th>
                      <th>Target Group</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Faculty</th> */}


                      <th style={{ width: "6%", whiteSpace: "nowrap" }}>Code</th>
                      <th style={{ width: "20%" }}>Name</th>
                      <th style={{ width: "12%" }}>Venue</th>
                      <th style={{ width: "8%" }}>Mode</th>
                      <th style={{ width: "8%" }}>Type</th>
                      <th style={{ width: "10%" }}>Start Date</th>
                      <th style={{ width: "10%" }}>End Date</th>
                      <th style={{ width: "15%" }}>Coordinator</th>
                      <th style={{ width: "8%", whiteSpace: "nowrap" }}># Participants</th>
                      <th style={{ width: "12%" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainings.map((t) => (
                      <tr key={t.code}>
                        <td>{t.code || "-"}</td>
                        <td className="text-start">{t.name}</td>
                        <td>{t.venue || "-"}</td>
                        <td>{t.mode || "-"}</td>
                        <td>{t.training_type || "-"}</td>
                        <td>{formatDate(t.start_date)}</td>
                        <td>{formatDate(t.end_date)}</td>
                        <td>{t.faculty_name_display || "-"}</td>
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
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setUserToDelete(t);
                                setShowDeleteModal(true);
                              }}
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
            ))
          )}
        </div>
        {/* 
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this entire training batch?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBatch}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal> */}

        {showTrainingForm && (
          <TrainingForm
            show={showTrainingForm}
            onHide={() => setShowTrainingForm(false)}
            onSuccess={fetchTrainings}
          />
        )}
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
      {/* Single Training Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Training Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete training{" "}
          <strong>{userToDelete?.name}</strong> Training Code:<strong>{userToDelete?.code}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(userToDelete.code)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </DashboardLayout>
  );
};

export default ManageTrainings;
