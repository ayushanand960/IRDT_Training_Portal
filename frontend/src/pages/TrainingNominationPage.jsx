


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Row, Col, Card, Button, ListGroup, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./TrainingNominationPage.css";




const TrainingNominationPage = () => {
  const { code } = useParams();
  const [training, setTraining] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [nominated, setNominated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const [filters, setFilters] = useState({
    institute: "",
    branch: "",
    designation: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    instituteList: [],
    branchList: [],
    designationList: [],
  });
  const handleShowAllUsers = (e) => {
    e.stopPropagation();
    navigate(`/users/all/${code}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trainingRes, traineeRes, nominatedRes] = await Promise.all([
          axiosInstance.get(`/training/training-programs/${code}/`),
          axiosInstance.get(`/training/enrolled-trainees/${code}/`),
          axiosInstance.get(`/training/nominated/${code}/`),
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

        const traineeData = traineeRes.data;

        // Generate filter options from trainees
        const institutes = Array.from(
          new Set(traineeData.map((t) => t.institute_name || t.institute).filter(Boolean))
        );
        const branches = Array.from(
          new Set(traineeData.map((t) => t.branch).filter(Boolean))
        );
        const designations = Array.from(
          new Set(traineeData.map((t) => t.designation).filter(Boolean))
        );

        setFilterOptions({
          instituteList: institutes,
          branchList: branches,
          designationList: designations,
        });

        setTrainees(traineeData);
        setNominated(nominatedRes.data);
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Failed to fetch training or trainee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

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


  const handleRemove = async (ehrms_code) => {
    try {
      await axiosInstance.delete(`/training/nomination/remove/${encodeURIComponent(code)}/${ehrms_code}/`)

      setNominated((prev) =>
        prev.filter((trainee) => trainee.ehrms_code !== ehrms_code)
      );
      toast.success("🗑️ Trainee removed successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "❌ Failed to remove trainee.");
    }
  };

  const isAlreadyNominated = (ehrms_code) =>
    nominated.some((t) => t.ehrms_code === ehrms_code);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTrainees = trainees.filter((trainee) => {
    const matchInstitute = filters.institute
      ? (trainee.institute_name || trainee.institute) === filters.institute
      : true;
    const matchBranch = filters.branch
      ? trainee.branch === filters.branch
      : true;
    const matchDesignation = filters.designation
      ? trainee.designation === filters.designation
      : true;
    return matchInstitute && matchBranch && matchDesignation;
  });

  if (loading)
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;

  return (
    <Row className="mt-3">
      <Col md={8}>
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h4 className="text-primary">{training.name}</h4>
            <p>
              <strong>Target Group:</strong> {training.target_group}
            </p>
            <p>
              <strong>Venue:</strong> {training.venue}
            </p>
            <p>
              <strong>Dates:</strong> {training.start_date} to {training.end_date}
            </p>
            <div className="text-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleShowAllUsers}
              >
                Show All Users
              </Button>
            </div>

            <hr />
            <h5>Available Trainees</h5>

            {/* Dropdown Filters */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Select
                  name="institute"
                  value={filters.institute}
                  onChange={handleFilterChange}
                >
                  <option value="">All Institutes</option>
                  {filterOptions.instituteList.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  name="branch"
                  value={filters.branch}
                  onChange={handleFilterChange}
                >
                  <option value="">All Branches</option>
                  {filterOptions.branchList.map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  name="designation"
                  value={filters.designation}
                  onChange={handleFilterChange}
                >
                  <option value="">All Designations</option>
                  {filterOptions.designationList.map((des) => (
                    <option key={des} value={des}>
                      {des}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Trainee List */}
            <ListGroup>
              {filteredTrainees.length === 0 && (
                <p>No trainees match the selected filters.</p>
              )}
              {filteredTrainees.map((trainee) => (
                <ListGroup.Item key={trainee.ehrms_code}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <strong>
                        {trainee.full_name ||
                          `${trainee.first_name} ${trainee.last_name}` ||
                          "Name Unavailable"}
                      </strong>
                      <br />
                      <span className="text-muted">({trainee.ehrms_code})</span>
                    </Col>
                    <Col md={3}>
                      <div>
                        <strong>Institute:</strong>{" "}
                        {trainee.institute_name || trainee.institute || "N/A"}
                      </div>
                    </Col>
                    <Col md={2}>
                      <div>
                        <strong>Branch:</strong> {trainee.branch || "N/A"}
                      </div>
                    </Col>
                    <Col md={2}>
                      <div>
                        <strong>Designation:</strong>{" "}
                        {trainee.designation || "N/A"}
                      </div>

                    </Col>
                    <Col md={2} className="text-end">
                      {isAlreadyNominated(trainee.ehrms_code) ? (
                        <span className="text-muted">Already Nominated</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleNominate(trainee)}
                        >
                          Nominate
                        </Button>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>

      {/* Nominated List */}
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="text-success">Nominated Trainees</h5>
            {nominated.length === 0 ? (
              <p>No trainees nominated yet.</p>
            ) : (
              <ListGroup as="ol" numbered>
                {nominated.map((trainee) => (
                  <ListGroup.Item
                    key={trainee.ehrms_code}
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{trainee.first_name} {trainee.last_name}</div>
                      <small className="text-muted">
                        {trainee.designation} 

                        EHRMS: {trainee.ehrms_code}
                      </small>
                    </div>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemove(trainee.ehrms_code)}
                    >
                      Remove
                    </Button>                                
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TrainingNominationPage;
