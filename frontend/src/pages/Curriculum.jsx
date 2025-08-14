import React, { useEffect, useState } from "react";
import { Table, Spinner, Form, Button, Container, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../assets/irdt-logo.png"; // ✅ For the topbar logo

export default function Curriculum() {
  const [trainings, setTrainings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ In case you want Home navigation
  const API_BASE = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchSessions();
    fetchTrainings();
  }, []);

  const fetchSessions = () => {
    axios
      .get(`${API_BASE}/training/curriculum/`)
      .then((res) => {
        const years = [...new Set(res.data.map((t) => t.session_year))];
        setSessions(years);
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  };

  const fetchTrainings = (session = "") => {
    setLoading(true);
    const url = session
      ? `${API_BASE}/training/curriculum/?session_year=${session}`
      : `${API_BASE}/training/curriculum/`;

    axios
      .get(url)
      .then((res) => {
        setTrainings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trainings:", err);
        setLoading(false);
      });
  };

  const handleSessionChange = (e) => {
    const session = e.target.value;
    setSelectedSession(session);
    fetchTrainings(session);
  };

  const downloadExcel = () => {
    if (trainings.length === 0) return;

    const worksheetData = trainings.map((t) => ({
      Code: t.code,
      "Program Name": t.name,
      "Target Group": t.target_group,
      "Session Year": t.session_year,
      "Faculty Name": t.faculty_name_display,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, `Curriculum_${selectedSession || "All"}.xlsx`);
  };

  const formatDate = (val) => {
    if (!val) return "";
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
    if (m) {
      const [, y, mo, d] = m;
      return `${d}/${mo}/${y}`;
    }
    const dt = new Date(val);
    return isNaN(dt) ? val : dt.toLocaleDateString("en-GB");
  };

  return (
    <>
      {/* ✅ Topbar logic without logout */}
      <div
        className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom shadow-sm"
        style={{ backgroundColor: "#006666" }}
      >
        {/* Left: Logo + Title */}
        <div className="d-flex align-items-center gap-3">
          <img
            src={logo}
            alt="IRDT Logo"
            style={{ height: "7vw", filter: "invert(1) brightness(2)" }}
          />
          <div>
            <h2 className="fw-bold mb-0 text-white">
              Institute for Research, Development & Training (IRDT)
            </h2>
            <big className="fw-semibold text-white">
              Government of Uttar Pradesh
            </big>
          </div>
        </div>

        {/* Right: Only Home Button */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/"
            className="btn btn-outline-light fw-semibold px-4 py-2"
            style={{ minWidth: "100px", textAlign: "center" }}
          >
            Home
          </Link>
        </div>
      </div>

      {/* ✅ Main content */}
      <Container className="mt-4">
        <Card className="shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">📚 Curriculum</h2>
            <Button variant="success" onClick={downloadExcel}>
              📥 Download Excel
            </Button>
          </div>

          <div className="d-flex align-items-end mb-3" style={{ gap: "15px" }}>
            <Form.Group style={{ maxWidth: "250px" }}>
              <Form.Label className="fw-bold">Filter by Session Year</Form.Label>
              <Form.Select value={selectedSession} onChange={handleSessionChange}>
                <option value="">All Sessions</option>
                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading curriculum...</p>
            </div>
          ) : (
            <Table responsive bordered hover className="align-middle shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>Code</th>
                  <th>Program Name</th>
                  <th>Target Group</th>
                  <th>Coordinator</th>
                  <th>Venue</th>
                  <th>Mode</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Participants</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training.code}>
                    <td>{training.code}</td>
                    <td>{training.name}</td>
                    <td>{training.target_group}</td>
                    <td>{training.faculty_name_display}</td>
                    <td>{training.venue}</td>
                    <td>{training.mode}</td>
                    <td>{formatDate(training.start_date)}</td>
                    <td>{formatDate(training.end_date)}</td>
                    <td>{training.number_of_participants}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </>
  );
}
