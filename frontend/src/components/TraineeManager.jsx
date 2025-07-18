// import React, { useState } from "react";
// import { Card, Form, Button, Alert } from "react-bootstrap";
// import axiosInstance from "../utils/axiosInstance";

// const TraineeManager = ({ users, trainings, coordinatorId }) => {
//   const [selectedTrainingId, setSelectedTrainingId] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState("");

//   const handleNominate = async () => {
//     if (!selectedTrainingId || !selectedUserId) {
//       setError("Please select both a training and a user.");
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(`/trainings/${selectedTrainingId}/assign/`, {
//         user_id: selectedUserId,
//         coordinator_id: coordinatorId,
//       });

//       setMessage(response.data.message || "User successfully nominated!");
//       setError("");
//       setSelectedUserId("");
//     } catch (err) {
//       setError("Failed to nominate user.");
//       setMessage("");
//     }
//   };

//   return (
//     <Card className="shadow">
//       <Card.Body>
//         <h5 className="mb-3">Nominate Users to Trainings</h5>

//         {message && <Alert variant="success">{message}</Alert>}
//         {error && <Alert variant="danger">{error}</Alert>}

//         <Form>
//           <Form.Group controlId="trainingSelect" className="mb-3">
//             <Form.Label>Select Training</Form.Label>
//             <Form.Select
//               value={selectedTrainingId}
//               onChange={(e) => setSelectedTrainingId(e.target.value)}
//             >
//               <option value="">-- Select Training --</option>
//               {trainings.map((training) => (
//                 <option key={training.id} value={training.id}>
//                   {training.title}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group controlId="userSelect" className="mb-3">
//             <Form.Label>Select User to Nominate</Form.Label>
//             <Form.Select
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value)}
//             >
//               <option value="">-- Select User --</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name || `${user.first_name} ${user.last_name}`} ({user.email})
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Button variant="primary" onClick={handleNominate}>
//             Nominate
//           </Button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// };

// export default TraineeManager;

// src/components/TraineeManager.jsx
// import React, { useState } from "react";
// import { Card, Form, Button, Alert } from "react-bootstrap";
// import axiosInstance from "../utils/axiosInstance";

// const TraineeManager = ({ users, trainings, coordinatorId }) => {
//   const [selectedTrainingCode, setSelectedTrainingCode] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState("");
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState("");

//   const handleNominate = async () => {
//     if (!selectedTrainingCode || !selectedUserId) {
//       setError("Please select both a training and a user.");
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(
//         `/trainings/${selectedTrainingCode}/assign/`,
//         {
//           user_id: selectedUserId,
//           coordinator_id: coordinatorId,
//         }
//       );

//       setMessage(response.data.message || "User successfully nominated!");
//       setError("");
//       setSelectedUserId("");
//     } catch (err) {
//       setError("Failed to nominate user.");
//       setMessage("");
//     }
//   };

//   return (
//     <Card className="shadow-sm border-0" style={{ backgroundColor: "#ffffff" }}>
//       <Card.Body>
//         {message && <Alert variant="success">{message}</Alert>}
//         {error && <Alert variant="danger">{error}</Alert>}

//         <Form>
//           <Form.Group controlId="trainingSelect" className="mb-3">
//             <Form.Label>Select Training</Form.Label>
//             <Form.Select
//               value={selectedTrainingCode}
//               onChange={(e) => setSelectedTrainingCode(e.target.value)}
//             >
//               <option value="">-- Select Training --</option>
//               {trainings.map((training) => (
//                 <option key={training.code} value={training.code}>
//                   {training.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>

//           <Form.Group controlId="userSelect" className="fs-6 fw-semibold text-secondary">
//             <Form.Label>Select User to Nominate</Form.Label>
//             <Form.Select
//               value={selectedUserId}
//               onChange={(e) => setSelectedUserId(e.target.value)}
//             >
//               <option value="">-- Select User --</option>
//               {users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name ||
//                     `${user.first_name} ${user.middle_name} ${user.last_name}`}{" "}
//                   ({user.ehrms_code})
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//  <br/>
//           <Button variant="outline-primary" onClick={handleNominate}>
           
             
//             Nominate
//           </Button>
//         </Form>
//       </Card.Body>
//     </Card>
//   );
// };

// export default TraineeManager;

import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axiosInstance from "../utils/axiosInstance";

const TraineeManager = ({ users, trainings }) => {
  const [selectedTrainingCode, setSelectedTrainingCode] = useState("");
  const [selectedUserEhrms, setSelectedUserEhrms] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  const handleNominate = async () => {
    if (!selectedTrainingCode || !selectedUserEhrms) {
      setError("⚠️ Please select both a training and a user.");
      setMessage(null);
      return;
    }

    try {
      const response = await axiosInstance.post(`/training/nominations/`, {
        trainee: selectedUserEhrms,
        training: selectedTrainingCode,
      });

      setMessage(response.data.message || "✅ User successfully nominated!");
      setError(null);
      setSelectedUserEhrms("");
    } catch (err) {
      console.error("Nomination error:", err);
      if (err.response?.data?.trainee) {
        setError(`🚫 ${err.response.data.trainee.join(" ")}`);
      } else {
        setError("❌ Failed to nominate user.");
      }
      setMessage(null);
    }
  };

  return (
    <Card className="shadow-sm border-0" style={{ backgroundColor: "#ffffff" }}>
      <Card.Body>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          {/* Select Training */}
          <Form.Group controlId="trainingSelect" className="mb-3">
            <Form.Label>Select Training</Form.Label>
            <Form.Select
              value={selectedTrainingCode}
              onChange={(e) => setSelectedTrainingCode(e.target.value)}
            >
              <option value="">-- Select Training --</option>
              {trainings.map((training) => (
                <option key={training.code} value={training.code}>
                  {training.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Select Trainee */}
          <Form.Group controlId="userSelect" className="fs-6 fw-semibold text-secondary">
            <Form.Label>Select User to Nominate</Form.Label>
            <Form.Select
              value={selectedUserEhrms}
              onChange={(e) => setSelectedUserEhrms(e.target.value)}
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.ehrms_code} value={user.ehrms_code}>
                  {`${user.first_name} ${user.middle_name || ""} ${user.last_name}`} ({user.ehrms_code})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <br />
          <Button variant="outline-primary" onClick={handleNominate}>
            Nominate
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TraineeManager;
