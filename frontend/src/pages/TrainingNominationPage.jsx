



// Updated TrainingNominationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  Row, Col, Card, Button, ListGroup, Spinner, Form, Modal, FormControl
} from "react-bootstrap";
import { toast } from "react-toastify";
import "./TrainingNominationPage.css";


import Topbar from "../components/Topbar";


const TrainingNominationPage = () => {
  const { code } = useParams();
  const [training, setTraining] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [nominated, setNominated] = useState([]);
  const [attended, setAttended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ institute: "", branch: "", designation: "" });
  const [filterOptions, setFilterOptions] = useState({
    instituteList: [],
    branchList: [],
    designationList: [],
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [trainingStatus, setTrainingStatus] = useState({
    isFinalized: false,
    editRequestStatus: null,
  });

  const handleShowRejectModal = (trainee) => {
    setSelectedTrainee(trainee);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedTrainee(null);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.warning("Please provide a rejection reason.");
      return;
    }
    try {
      await axiosInstance.post(`/training/rejections/`, {
        trainee: selectedTrainee.ehrms_code,
        training: code,
        reason: rejectionReason,
      });
      toast.success(`❌ Rejected ${selectedTrainee.first_name} successfully.`);
      setTrainees((prev) => prev.filter(t => t.ehrms_code !== selectedTrainee.ehrms_code));
      handleCloseRejectModal();
    } catch (err) {
      toast.error(err.response?.data?.error || "Rejection failed.");
    }
  };

  const handleShowAllUsers = (e) => {
    e.stopPropagation();
    navigate(`/users/all/${code}`);
  };

  // ✅ New navigation to Past Trainings page
  const handleViewPastTrainings = (ehrmsCode) => {
    navigate(`/users/${ehrmsCode}/trainings`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trainingRes, traineeRes, nominatedRes, attendedRes] = await Promise.all([
          axiosInstance.get(`/training/training-programs/${encodeURIComponent(code)}/`),
          axiosInstance.get(`/training/enrolled-trainees/${encodeURIComponent(code)}/`),
          axiosInstance.get(`/training/nominated/${encodeURIComponent(code)}/`),
          axiosInstance.get(`/training/attended/${encodeURIComponent(code)}/`),
        ]);

        setTraining({
          name:
            trainingRes.data.title ||
            `${trainingRes.data.name} [${code}]` ||
            `Training Code: ${code}`,
          target_group: trainingRes.data.target_group || "",
          venue: trainingRes.data.venue || "",
          start_date: trainingRes.data.start_date || "",
          end_date: trainingRes.data.end_date || "",
        });

        setTrainingStatus({
          isFinalized: trainingRes.data?.is_finalized || false,
          editRequestStatus: trainingRes.data?.edit_request_status || null,
        });

        const traineeData = traineeRes.data;

        setFilterOptions({
          instituteList: Array.from(new Set(traineeData.map((t) => t.institute_name || t.institute).filter(Boolean))),
          branchList: Array.from(new Set(traineeData.map((t) => t.branch).filter(Boolean))),
          designationList: Array.from(new Set(traineeData.map((t) => t.designation).filter(Boolean))),
        });

        setTrainees(traineeData);
        setNominated(nominatedRes.data);
        setAttended(attendedRes.data);
      } catch (err) {
        console.error("🔥 Error in fetchData:", err);
        toast.error("⚠️ Failed to fetch training or trainee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  const handleRequestEdit = async () => {
    try {
      await axiosInstance.post(`/training/request-edit/${code}/`);
      toast.success("Edit request submitted.");
      setTrainingStatus((prev) => ({ ...prev, editRequestStatus: "pending" }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request edit.");
    }
  };

  const handleNominate = async (trainee) => {
    try {
      await axiosInstance.post("/training/nominate-multiple/", {
        training_code: code,
        trainee_ehrms_codes: [trainee.ehrms_code],
      });
      setNominated((prev) => [...prev, trainee]);
      toast.success(`✅ Nominated ${trainee.first_name}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "⚠️ Nomination failed.");
    }
  };

  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalizeNomination = async (trainingCode) => {
    try {
      setIsFinalizing(true); // show spinner
      const res = await axiosInstance.post(
        `/training/finalize-nominations/${trainingCode}/`
      );
      toast.success(res.data.message);
      setTrainingStatus((prev) => ({ ...prev, isFinalized: true }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to finalize.");
    } finally {
      setIsFinalizing(false); // hide spinner
    }
  };

  const handleDownloadXLSX = async () => {
    try {
      const response = await axiosInstance.get(`/training/download-final-nominations/${code}/`, {
        responseType: 'blob',
      });
      const blob = new Blob(
        [response.data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FinalNominations_${code}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed.");
    }
  };

  const handleRemove = async (ehrms_code) => {
    try {
      await axiosInstance.delete(`/training/nomination/remove/${encodeURIComponent(code)}/${ehrms_code}/`);
      setNominated((prev) => prev.filter((trainee) => trainee.ehrms_code !== ehrms_code));
      toast.success("🗑️ Trainee removed successfully.");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Failed to remove trainee.");
    }
  };

  const isAlreadyNominated = (ehrms_code) =>
    nominated.some((t) => t.ehrms_code === ehrms_code);
  const isAlreadyAttended = (ehrms_code) =>
    attended.some((t) => t.ehrms_code === ehrms_code);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const matchInstitute = filters.institute
      ? (trainee.institute_name || trainee.institute) === filters.institute
      : true;
    const matchBranch = filters.branch ? trainee.branch === filters.branch : true;
    const matchDesignation = filters.designation ? trainee.designation === filters.designation : true;
    return matchInstitute && matchBranch && matchDesignation;
  });

  if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  const canEdit = !trainingStatus.isFinalized;

  return (
    <>
      <Topbar />
      <Row className="mt-3">
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="text-primary">{training.name}</h4>
              <p><strong>Target Group:</strong> {training.target_group}</p>
              <p><strong>Venue:</strong> {training.venue}</p>
              <p><strong>Dates:</strong> {training.start_date} to {training.end_date}</p>
              <div className="text-end">
                <Button variant="outline-secondary" size="sm" onClick={handleShowAllUsers} disabled={!canEdit}>
                  Show All Users
                </Button>
              </div>
              <hr />
              <h5>Available Trainees</h5>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Select name="institute" value={filters.institute} onChange={handleFilterChange}>
                    <option value="">All Institutes</option>
                    {filterOptions.instituteList.map((inst) => (
                      <option key={inst} value={inst}>{inst}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select name="branch" value={filters.branch} onChange={handleFilterChange}>
                    <option value="">All Branches</option>
                    {filterOptions.branchList.map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select name="designation" value={filters.designation} onChange={handleFilterChange}>
                    <option value="">All Designations</option>
                    {filterOptions.designationList.map((des) => (
                      <option key={des} value={des}>{des}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <ListGroup>
                {filteredTrainees.length === 0 && <p>No trainees match the selected filters.</p>}
                {filteredTrainees.map((trainee) => (
                  <ListGroup.Item key={trainee.ehrms_code}>
                    <Row className="align-items-center">
                      <Col md={3}>
                        <strong
                          style={{ cursor: "pointer", color: "#007bff" }}
                          onClick={() => handleViewPastTrainings(trainee.ehrms_code)}
                        >
                          {trainee.full_name || `${trainee.first_name} ${trainee.last_name}`}
                        </strong><br />
                        <span className="text-muted">({trainee.ehrms_code})</span>
                      </Col>
                      <Col md={3}><strong>Institute:</strong> {trainee.institute_name || trainee.institute}</Col>
                      <Col md={2}><strong>Branch:</strong> {trainee.branch || "N/A"}</Col>
                      <Col md={2}><strong>Designation:</strong> {trainee.designation || "N/A"}</Col>
                      <Col md={2} className="text-end">
                        {isAlreadyAttended(trainee.ehrms_code) ? (
                          <span className="text-muted">Already Attended</span>
                        ) : isAlreadyNominated(trainee.ehrms_code) ? (
                          <span className="text-muted">Already Nominated</span>
                        ) : (
                          <>
                            <Button size="sm" variant="success" onClick={() => handleNominate(trainee)} disabled={!canEdit} className="me-2">Nominate</Button>
                            <Button size="sm" variant="outline-danger" onClick={() => handleShowRejectModal(trainee)}>Reject</Button>
                          </>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Nominated Trainees */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="text-success">Nominated Trainees</h5>
              <hr />
              {trainingStatus.isFinalized ? (
                <>
                  <div className="button-container">
                    <Button className="nomination-btn me-2" onClick={handleDownloadXLSX}>Download Final XLSX</Button>


                    <Button
                      className="nomination-btn"
                      // variant="outline-primary"
                      onClick={handleRequestEdit}
                    >
                      {trainingStatus.editRequestStatus === "pending"
                        ? "Edit Access Pending (Request Again)"
                        : trainingStatus.editRequestStatus === "approved"
                          ? "Request Again"
                          : trainingStatus.editRequestStatus === "rejected"
                            ? "Request Again"
                            : "Request Edit Access"}
                    </Button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => handleFinalizeNomination(code)}
                  disabled={isFinalizing}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-black rounded-md disabled:opacity-50"
                >
                  {isFinalizing && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  {isFinalizing ? "Finalizing..." : "Finalize Nomination"}
                </button>
              )}

              {nominated.length === 0 ? (
                <p>No trainees nominated yet.</p>
              ) : (
                <ListGroup as="ol" numbered>
                  {nominated.map((trainee) => (
                    <ListGroup.Item key={trainee.ehrms_code} as="li" className="d-flex justify-content-between align-items-start">
                      <div className="nominated-name ms-2 me-auto">
                        <div
                          className="fw-bold"
                          style={{ cursor: "pointer", color: "#007bff" }}
                          onClick={() => handleViewPastTrainings(trainee.ehrms_code)}
                        >
                          {trainee.first_name} {trainee.last_name}
                        </div>
                        <small className="text-muted">{trainee.designation} EHRMS: {trainee.ehrms_code}</small>
                      </div>
                      <Button size="sm" variant="danger" onClick={() => handleRemove(trainee.ehrms_code)} disabled={!canEdit}>Remove</Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Rejection Modal */}
      <Modal show={showRejectModal} onHide={handleCloseRejectModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Trainee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTrainee && (
            <>
              <p><strong>Name:</strong> {selectedTrainee.first_name} {selectedTrainee.last_name}</p>
              <p><strong>EHRMS Code:</strong> {selectedTrainee.ehrms_code}</p>
              <Form.Group>
                <Form.Label>Reason for Rejection</Form.Label>
                <FormControl
                  as="textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide reason here..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRejectModal}>Cancel</Button>
          <Button variant="danger" onClick={handleRejectConfirm}>Confirm Reject</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingNominationPage;

// // ... (previous imports)
// // Updated TrainingNominationPage.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import {
//   Row, Col, Card, Button, ListGroup, Spinner, Form, Modal, InputGroup, FormControl
// } from "react-bootstrap";
// import { toast } from "react-toastify";
// import "./TrainingNominationPage.css";


// const TrainingNominationPage = () => {
//   const { code } = useParams();
//   const [training, setTraining] = useState(null);
//   const [trainees, setTrainees] = useState([]);
//   const [nominated, setNominated] = useState([]);
//   const [attended, setAttended] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [filters, setFilters] = useState({ institute: "", branch: "", designation: "" });
//   const [filterOptions, setFilterOptions] = useState({
//     instituteList: [],
//     branchList: [],
//     designationList: [],

//   });

//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [selectedTrainee, setSelectedTrainee] = useState(null);
//   const [trainingStatus, setTrainingStatus] = useState({
//     isFinalized: false,
//     editRequestStatus: null,
//   });




//   const handleShowRejectModal = (trainee) => {
//     setSelectedTrainee(trainee);
//     setShowRejectModal(true);
//   };

//   const handleCloseRejectModal = () => {
//     setShowRejectModal(false);
//     setRejectionReason("");
//     setSelectedTrainee(null);
//   };



//   const handleRejectConfirm = async () => {
//     if (!rejectionReason.trim()) {
//       toast.warning("Please provide a rejection reason.");
//       return;
//     }
//     try {
//       await axiosInstance.post(`/training/rejections/`, {
//         trainee: selectedTrainee.ehrms_code,
//         training: code,
//         reason: rejectionReason,
//       });
//       toast.success(`❌ Rejected ${selectedTrainee.first_name} successfully.`);
//       setTrainees((prev) => prev.filter(t => t.ehrms_code !== selectedTrainee.ehrms_code));
//       handleCloseRejectModal();
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Rejection failed.");
//     }
//   };

//   const handleShowAllUsers = (e) => {
//     e.stopPropagation();
//     navigate(`/users/all/${code}`);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [trainingRes, traineeRes, nominatedRes, attendedRes] = await Promise.all([
//           axiosInstance.get(`/training/training-programs/${encodeURIComponent(code)}/`),
//           axiosInstance.get(`/training/enrolled-trainees/${encodeURIComponent(code)}/`),
//           axiosInstance.get(`/training/nominated/${encodeURIComponent(code)}/`),
//           axiosInstance.get(`/training/attended/${encodeURIComponent(code)}/`),
//         ]);

//         console.log("➡️ trainingRes:", trainingRes);
//         console.log("➡️ traineeRes:", traineeRes);
//         console.log("➡️ nominatedRes:", nominatedRes);
//         console.log("➡️ attendedRes:", attendedRes);


//         setTraining({
//           name:
//             trainingRes.data.title ||
//             `${trainingRes.data.name} [${code}]` ||
//             `Training Code: ${code}`,
//           target_group: trainingRes.data.target_group || "",
//           venue: trainingRes.data.venue || "",
//           start_date: trainingRes.data.start_date || "",
//           end_date: trainingRes.data.end_date || "",
//         });

//         setTrainingStatus({
//           isFinalized: trainingRes.data?.is_finalized || false,
//           editRequestStatus: trainingRes.data?.edit_request_status || null,
//         });
//         console.log("✅ isFinalized =", trainingRes.data?.is_finalized);
//         console.log("✅ editRequestStatus =", trainingRes.data?.edit_request_status);




//         const traineeData = traineeRes.data;


//         setFilterOptions({
//           instituteList: Array.from(new Set(traineeData.map((t) => t.institute_name || t.institute).filter(Boolean))),
//           branchList: Array.from(new Set(traineeData.map((t) => t.branch).filter(Boolean))),
//           designationList: Array.from(new Set(traineeData.map((t) => t.designation).filter(Boolean))),
//         });

//         setTrainees(traineeData);
//         setNominated(nominatedRes.data);
//         setAttended(attendedRes.data);
//       } catch (err) {
//         console.error(err);
//         console.error("🔥 Error in fetchData:", err);
//         toast.error("⚠️ Failed to fetch training or trainee data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [code]);


//   const handleRequestEdit = async () => {
//     try {
//       await axiosInstance.post(`/training/request-edit/${code}/`);
//       toast.success("Edit request submitted.");
//       setTrainingStatus((prev) => ({ ...prev, editRequestStatus: "pending" }));
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to request edit.");
//     }
//   };

//   const handleNominate = async (trainee) => {
//     try {
//       await axiosInstance.post("/training/nominate-multiple/", {
//         training_code: code,
//         trainee_ehrms_codes: [trainee.ehrms_code],
//       });
//       setNominated((prev) => [...prev, trainee]);
//       toast.success(`✅ Nominated ${trainee.first_name}`);
//     } catch (err) {
//       toast.error(err.response?.data?.error || "⚠️ Nomination failed.");
//     }
//   };

//   const handleFinalizeNomination = async (trainingCode) => {
//     try {
//       const res = await axiosInstance.post(`/training/finalize-nominations/${trainingCode}/`);
//       toast.success(res.data.message);
//       setTrainingStatus((prev) => ({ ...prev, isFinalized: true }));
//       // Refresh state/UI
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Failed to finalize.");
//     }
//   };


//   const handleDownloadXLSX = async () => {
//     try {
//       const response = await axiosInstance.get(`/training/download-final-nominations/${code}/`, {
//         responseType: 'blob',
//       });

//       const blob = new Blob(
//         [response.data],
//         { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
//       );
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `FinalNominations_${code}.xlsx`;  // ✅ Correct extension
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed", error);
//       toast.error("Download failed.");
//     }
//   };


//   const handleRemove = async (ehrms_code) => {
//     try {
//       await axiosInstance.delete(`/training/nomination/remove/${encodeURIComponent(code)}/${ehrms_code}/`);
//       setNominated((prev) => prev.filter((trainee) => trainee.ehrms_code !== ehrms_code));
//       toast.success("🗑️ Trainee removed successfully.");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.error || "❌ Failed to remove trainee.");
//     }
//   };

//   const isAlreadyNominated = (ehrms_code) =>
//     nominated.some((t) => t.ehrms_code === ehrms_code);
//   const isAlreadyAttended = (ehrms_code) =>
//     attended.some((t) => t.ehrms_code === ehrms_code);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredTrainees = trainees.filter((trainee) => {
//     const matchInstitute = filters.institute
//       ? (trainee.institute_name || trainee.institute) === filters.institute
//       : true;
//     const matchBranch = filters.branch ? trainee.branch === filters.branch : true;
//     const matchDesignation = filters.designation ? trainee.designation === filters.designation : true;
//     return matchInstitute && matchBranch && matchDesignation;
//   });

//   if (loading) return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
//   const canEdit = !trainingStatus.isFinalized;
//   return (
//     <>
//       <Row className="mt-3">
//         <Col md={8}>
//           <Card className="mb-4 shadow-sm">
//             <Card.Body>
//               <h4 className="text-primary">{training.name}</h4>
//               <p><strong>Target Group:</strong> {training.target_group}</p>
//               <p><strong>Venue:</strong> {training.venue}</p>
//               <p><strong>Dates:</strong> {training.start_date} to {training.end_date}</p>
//               <div className="text-end">
//                 <Button variant="outline-secondary" size="sm" onClick={handleShowAllUsers}disabled={!canEdit}>Show All Users</Button>
//               </div>
//               <hr />
//               <h5>Available Trainees</h5>
//               <Row className="mb-3">
//                 <Col md={4}>
//                   <Form.Select name="institute" value={filters.institute} onChange={handleFilterChange}>
//                     <option value="">All Institutes</option>
//                     {filterOptions.instituteList.map((inst) => (
//                       <option key={inst} value={inst}>{inst}</option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//                 <Col md={4}>
//                   <Form.Select name="branch" value={filters.branch} onChange={handleFilterChange}>
//                     <option value="">All Branches</option>
//                     {filterOptions.branchList.map((br) => (
//                       <option key={br} value={br}>{br}</option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//                 <Col md={4}>
//                   <Form.Select name="designation" value={filters.designation} onChange={handleFilterChange}>
//                     <option value="">All Designations</option>
//                     {filterOptions.designationList.map((des) => (
//                       <option key={des} value={des}>{des}</option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//               </Row>
//               <ListGroup>
//                 {filteredTrainees.length === 0 && <p>No trainees match the selected filters.</p>}
//                 {filteredTrainees.map((trainee) => (
//                   <ListGroup.Item key={trainee.ehrms_code}>
//                     <Row className="align-items-center">
//                       <Col md={3}>
//                         <strong>{trainee.full_name || `${trainee.first_name} ${trainee.last_name}`}</strong><br />
//                         <span className="text-muted">({trainee.ehrms_code})</span>
//                       </Col>
//                       <Col md={3}><strong>Institute:</strong> {trainee.institute_name || trainee.institute}</Col>
//                       <Col md={2}><strong>Branch:</strong> {trainee.branch || "N/A"}</Col>
//                       <Col md={2}><strong>Designation:</strong> {trainee.designation || "N/A"}</Col>
//                       <Col md={2} className="text-end">
//                         {isAlreadyAttended(trainee.ehrms_code) ? (
//                           <span className="text-muted">Already Attended</span>
//                         ) : isAlreadyNominated(trainee.ehrms_code) ? (
//                           <span className="text-muted">Already Nominated</span>
//                         ) : (
//                           <>
//                             <Button size="sm" variant="success" onClick={() => handleNominate(trainee)}disabled={!canEdit} className="me-2">Nominate</Button>
//                             <Button size="sm" variant="outline-danger" onClick={() => handleShowRejectModal(trainee)}>Reject</Button>
//                           </>
//                         )}
//                       </Col>
//                     </Row>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col md={4}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <h5 className="text-success">Nominated Trainees</h5>
//               <hr />
//               {trainingStatus.isFinalized ? (
//                 <>
//                   <Button className="me-2" onClick={handleDownloadXLSX}>⬇️ Download Final XLSX</Button>
//                   {trainingStatus.editRequestStatus === "approved" ? (
//                     <span className="text-success fw-bold">✅ Edit Access Approved</span>
//                   ) : (
//                     <Button
//                       variant="outline-primary"
//                       onClick={handleRequestEdit}
//                       disabled={trainingStatus.editRequestStatus === "pending"}
//                     >
//                       {trainingStatus.editRequestStatus === "pending"
//                         ? "⏳ Edit Access Pending"
//                         : "✏️ Request Edit Access"}
//                     </Button>
//                   )}
//                 </>
//               ) : (
//                 <Button variant="primary" onClick={() => handleFinalizeNomination(code)}>
//                   ✅ Finalize Nominations
//                 </Button>
//               )}







//               {nominated.length === 0 ? (
//                 <p>No trainees nominated yet.</p>
//               ) : (
//                 <ListGroup as="ol" numbered>
//                   {nominated.map((trainee) => (
//                     <ListGroup.Item key={trainee.ehrms_code} as="li" className="d-flex justify-content-between align-items-start">
//                       <div className="ms-2 me-auto">
//                         <div className="fw-bold">{trainee.first_name} {trainee.last_name}</div>
//                         <small className="text-muted">{trainee.designation} EHRMS: {trainee.ehrms_code}</small>
//                       </div>
//                       <Button size="sm" variant="danger" onClick={() => handleRemove(trainee.ehrms_code)}disabled={!canEdit} >Remove</Button>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row >

//       {/* Rejection Modal */}
//       < Modal show={showRejectModal} onHide={handleCloseRejectModal} centered >
//         <Modal.Header closeButton>
//           <Modal.Title>Reject Trainee</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTrainee && (
//             <>
//               <p><strong>Name:</strong> {selectedTrainee.first_name} {selectedTrainee.last_name}</p>
//               <p><strong>EHRMS Code:</strong> {selectedTrainee.ehrms_code}</p>
//               <Form.Group>
//                 <Form.Label>Reason for Rejection</Form.Label>
//                 <FormControl
//                   as="textarea"
//                   rows={3}
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Provide reason here..."
//                 />
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseRejectModal}>Cancel</Button>
//           <Button variant="danger" onClick={handleRejectConfirm}>Confirm Reject</Button>
//         </Modal.Footer>
//       </Modal >
//     </>
//   );
// };

// export default TrainingNominationPage;
