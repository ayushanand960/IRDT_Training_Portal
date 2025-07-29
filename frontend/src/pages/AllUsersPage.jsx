// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { Table, Spinner, Alert, Container, Card } from "react-bootstrap";

// const AllUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axiosInstance.get("/login/users/"); // Adjust to your actual endpoint
//         setUsers(res.data);
//       } catch (err) {
//         setError("Failed to fetch users.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) return <Spinner animation="border" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <Container className="mt-4">
//       <Card className="p-3 shadow-sm mb-4">
//         <h4 className="text-primary">All Registered Users</h4>
//         <p>Total: {users.length}</p>
//       </Card>

//       {users.length === 0 ? (
//         <Alert variant="info">No users found.</Alert>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead className="table-primary">
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Branch</th>
//               <th>Institute</th>
//               <th>Designation</th>
             
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user.id || index}>
//                 <td>{index + 1}</td>
//                 <td>{user.full_name}</td>
//                 <td>{user.branch}</td>
//                 <td>{user.institute_name}</td>
//                 <td>{user.designation}</td>
               
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Table,
  Spinner,
  Alert,
  Container,
  Card,
  Form,
  Button,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AllUsersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code: trainingCode } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({}); // ehrms_code: true/false

  useEffect(() => {
    if (!trainingCode) {
      toast.error("❌ No training code provided in URL.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/login/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [trainingCode]);

  const handleCheckboxChange = (ehrms_code) => {
    setSelected((prev) => ({
      ...prev,
      [ehrms_code]: !prev[ehrms_code],
    }));
  };

  const handleSubmit = async () => {
    const selectedUsers = Object.entries(selected)
      .filter(([_, isChecked]) => isChecked)
      .map(([ehrms_code]) => ehrms_code);

    if (!trainingCode) {
      toast.error("Training code not provided.");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.warn("Please select at least one user.");
      return;
    }

    try {
      await axiosInstance.post("/training/nominate-multiple/", {
        training_code: trainingCode,
        trainee_ehrms_codes: selectedUsers,
      });

      toast.success(`✅ Nominated ${selectedUsers.length} user(s)`);
      navigate(`/trainings/${trainingCode}`);
    } catch (err) {
      console.error("Nomination Error:", err.response || err.message);
      toast.error(err.response?.data?.error || "Nomination failed.");
    }
  };

  if (loading)
    return <Spinner animation="border" className="mt-5 d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Card className="p-3 shadow-sm mb-4">
        <h4 className="text-primary">All Registered Users</h4>
        <p>Total: {users.length}</p>
      </Card>

      {users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>Select</th>
                <th>#</th>
                <th>EHRMS CODE</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Institute</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.ehrms_code}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={!!selected[user.ehrms_code]}
                      onChange={() => handleCheckboxChange(user.ehrms_code)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{user.ehrms_code}</td>
                  <td>{user.full_name}</td>
                  <td>{user.branch}</td>
                  <td>{user.institute_name}</td>
                  <td>{user.designation}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end">
            <Button variant="success" onClick={handleSubmit}>
              Submit Selected
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default AllUsersPage;
