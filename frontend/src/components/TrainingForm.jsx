// // src/components/TrainingForm.jsx
// import React, { useState, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";
// import axios from "axios"; //  "../utils/axios" if you're using custom instance

// const TrainingForm = ({ training, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     date: "",
//     duration: "",
//     coordinator: "",
//   });

//   useEffect(() => {
//     if (training) {
//       setFormData({
//         title: training.title || "",
//         date: training.date || "",
//         duration: training.duration || "",
//         coordinator: training.coordinator || "",
//       });
//     }
//   }, [training]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (training && training._id) {
//         await axios.put(`/trainings/${training._id}`, formData);
//       } else {
//         await axios.post("/trainings", formData);
//       }
//       onSuccess(); // refresh training list in parent
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting form");
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       <Form.Group className="mb-3">
//         <Form.Label>Title</Form.Label>
//         <Form.Control
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Date</Form.Label>
//         <Form.Control
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Duration</Form.Label>
//         <Form.Control
//           name="duration"
//           value={formData.duration}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Coordinator</Form.Label>
//         <Form.Control
//           name="coordinator"
//           value={formData.coordinator}
//           onChange={handleChange}
//           required
//         />
//       </Form.Group>

//       <Button type="submit" className="mt-3">
//         {training ? "Update" : "Add"}
//       </Button>
//     </Form>
//   );
// };

// export default TrainingForm;




// src/components/TrainingForm.jsx

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
    faculty: "",
    number_of_participants: "",
    remark: "",
  });

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
        faculty: training.faculty || "",
        number_of_participants: training.number_of_participants || "",
        remark: training.remark || "",
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
      if (training && training.id) {
        await axiosInstance.put(`/training/training-programs/${training.id}/`, formData);
      } else {
        await axiosInstance.post("/training/training-programs/", formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit training data.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {["code", "name", "target_group", "faculty", "remark"].map((field) => (
        <Form.Group className="mb-3" key={field}>
          <Form.Label>{field.replace(/_/g, " ").toUpperCase()}</Form.Label>
          <Form.Control
            name={field}
            value={formData[field]}
            onChange={handleChange}
          />
        </Form.Group>
      ))}

      <Form.Group className="mb-3">
        <Form.Label>Venue</Form.Label>
        <Form.Select name="venue" value={formData.venue} onChange={handleChange}>
          <option value="">Select Venue</option>
          <option value="IRDT">IRDT</option>
          <option value="NITTTR Chandigarh">NITTTR Chandigarh</option>
          <option value="NITTTR Bhopal">NITTTR Bhopal</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mode</Form.Label>
        <Form.Select name="mode" value={formData.mode} onChange={handleChange}>
          <option value="">Select Mode</option>
          <option value="Contact">Contact</option>
          <option value="Online">Online</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Training Type</Form.Label>
        <Form.Select name="training_type" value={formData.training_type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="T">Training</option>
          <option value="NT">Non-Training</option>
        </Form.Select>
      </Form.Group>

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

      <Form.Group className="mb-3">
        <Form.Label>No. of Participants</Form.Label>
        <Form.Control
          type="number"
          name="number_of_participants"
          value={formData.number_of_participants}
          onChange={handleChange}
          min={0}
          max={1000}
        />
      </Form.Group>

      <Button type="submit" className="mt-2">
        {training ? "Update" : "Add"}
      </Button>
    </Form>
  );
};

export default TrainingForm;
