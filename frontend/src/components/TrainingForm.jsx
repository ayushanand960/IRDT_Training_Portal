import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";

const TrainingForm = ({ training, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    target_group: "",
    venue: "",
    mode: "",
    training_type: "",
    start_date: "",
    end_date: "",
    faculty: "", // ehrms_code of coordinator
    number_of_participants: "",
    remark: "",
  });

  const [coordinators, setCoordinators] = useState([]);

  // Fetch coordinator list
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await axiosInstance.get("/login/coordinators/");
        setCoordinators(res.data); // Expects array of { ehrms_code, full_name }
      } catch (err) {
        console.error("Failed to load coordinators", err);
      }
    };
    fetchCoordinators();
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (training) {
      setFormData({
        code: training.code || "",
        name: training.name || "",
        target_group: training.target_group || "",
        venue: training.venue || "",
        mode: training.mode || "",
        training_type: training.training_type || "",
        start_date: training.start_date || "",
        end_date: training.end_date || "",
        faculty: training.faculty || "", // should be ehrms_code
        number_of_participants: training.number_of_participants || "",
        remark: training.remark || "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        target_group: "",
        venue: "",
        mode: "",
        training_type: "",
        start_date: "",
        end_date: "",
        faculty: "",
        number_of_participants: "",
        remark: "",
      });
    }
  }, [training]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (training) {
        // Update using original code
        await axiosInstance.put(
          `/training/training-programs/${training.code}/`,
          formData
        );
      } else {
        // Create new training
        await axiosInstance.post("/training/training-programs/", formData);
      }

      onSuccess(); // Close modal & refresh list
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.data) {
        const messages = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        alert(`Error:\n${messages}`);
      } else {
        alert("Failed to submit training data.");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Code (disabled on edit) */}
      <Form.Group className="mb-3">
        <Form.Label>CODE</Form.Label>
        <Form.Control
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          disabled={!!training} // disable in edit mode
        />
      </Form.Group>

      {/* Text Fields */}
      {["name", "target_group", "remark"].map((field) => (
        <Form.Group className="mb-3" key={field}>
          <Form.Label>{field.replace(/_/g, " ").toUpperCase()}</Form.Label>
          <Form.Control
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={field === "name"}
          />
        </Form.Group>
      ))}

      {/* Venue */}
      <Form.Group className="mb-3">
        <Form.Label>Venue</Form.Label>
        <Form.Select
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
        >
          <option value="">Select Venue</option>
          <option value="IRDT">IRDT</option>
          <option value="NITTTR Chandigarh">NITTTR Chandigarh</option>
          <option value="NITTTR Bhopal">NITTTR Bhopal</option>
        </Form.Select>
      </Form.Group>

      {/* Mode */}
      <Form.Group className="mb-3">
        <Form.Label>Mode</Form.Label>
        <Form.Select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          required
        >
          <option value="">Select Mode</option>
          <option value="Contact">Contact</option>
          <option value="Online">Online</option>
        </Form.Select>
      </Form.Group>

      {/* Training Type */}
      <Form.Group className="mb-3">
        <Form.Label>Training Type</Form.Label>
        <Form.Select
          name="training_type"
          value={formData.training_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="T">Training</option>
          <option value="NT">Non-Training</option>
        </Form.Select>
      </Form.Group>

      {/* Dates */}
      <Form.Group className="mb-3">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Coordinator Dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>Coordinator (Faculty)</Form.Label>
        <Form.Select
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          required
        >
          <option value="">Select Coordinator</option>
          {coordinators.map((coord) => (
            <option key={coord.ehrms_code} value={coord.ehrms_code}>
              {coord.full_name} ({coord.ehrms_code})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* No. of Participants */}
      <Form.Group className="mb-3">
        <Form.Label>No. of Participants</Form.Label>
        <Form.Control
          type="number"
          name="number_of_participants"
          value={formData.number_of_participants}
          onChange={handleChange}
          min={0}
          max={1000}
          required
        />
      </Form.Group>

      {/* Submit Button */}
      <Button type="submit" className="mt-2">
        {training ? "Update" : "Add"}
      </Button>
    </Form>
  );
};

export default TrainingForm;
