

// import React, { useState, useEffect } from "react";
// import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
// import { toast } from "react-toastify";
// import axiosInstance from "../utils/axiosInstance";
// import { polytechnics } from "../data/polytechnics";
// import { branches } from "../data/branches";
// import designations from "../data/designations";
// import DashboardLayout from "../components/DashboardLayout";

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

//   const fetchUsers = async () => {
//     try {
//       const response = await axiosInstance.get("/login/users/");
//       setUsers(response.data);
//     } catch (err) {
//       console.error("Failed to load users:", err);
//       toast.error("Failed to load users");
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleAdd = () => {
//     setEditingUser(null);
//     setShowModal(true);
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setShowModal(true);
//   };

//   const handleDelete = async (ehrms_code) => {
//     try {
//       await axiosInstance.delete(`/login/users/${ehrms_code}/`);
//       toast.success("User deleted successfully");
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete user");
//     }
//   };

//   return (
//       <DashboardLayout>
//     <div className="p-4">
//       {/* Header with page title and Add User button */}
//       <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
//         <h3 className="mb-2 mb-md-0">Manage Users</h3>
//         <Button variant="primary" onClick={handleAdd}>
//           Add User
//         </Button>
//       </div>

//       {/* Table wrapper with horizontal scroll on small screens */}
//       {/* <div style={{ overflowX: 'auto' }}> */}
//         <Table striped bordered hover responsive="md" className="mb-5">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>EHRMS</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Institute</th>
//               <th>Branch</th>
//               <th>Designation</th>
//               <th>Role</th>
//               <th>Security Question</th>
//               <th>Security Answer</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, idx) => (
//               <tr key={user.ehrms_code}>
//                 <td>{idx + 1}</td>
//                 <td>{user.ehrms_code}</td>
//                 <td>{[user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')}</td>
//                 <td>{user.email}</td>
//                 <td>{user.mobile_number}</td>
//                 <td>{user.institute_name}</td>
//                 <td>{user.branch}</td>
//                 <td>{user.designation}</td>
//                 <td>{user.role}</td>
//                 <td>{user.security_question}</td>
//                 <td>{user.security_answer}</td>
//                 <td className="align-middle">
//                   <div className="d-flex gap-2 justify-content-center flex-wrap">
//                     <Button
//                       variant="warning"
//                       size="sm"
//                       onClick={() => handleEdit(user)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       variant="danger"
//                       size="sm"
//                       onClick={() => handleDelete(user.ehrms_code)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       {/* </div> */}

//       {showModal && (
//         <UserModal
//           show={showModal}
//           onHide={() => setShowModal(false)}
//           editingUser={editingUser}
//           fetchUsers={fetchUsers}
//         />
//       )}
//     </div>
//   </DashboardLayout>
//   );
// };

// const UserModal = ({ show, onHide, editingUser, fetchUsers }) => {
//   const [formData, setFormData] = useState({
//     ehrms_code: "",
//     name: "",
//     email: "",
//     mobile_number: "",
//     institute_name: "",
//     branch: "",
//     designation: "",
//     role: "",
//     security_question: "",
//     security_answer: "",
//   });

//   useEffect(() => {
//     if (editingUser) {
//       setFormData({ ...editingUser });
//     } else {
//       setFormData({
//         ehrms_code: "",
//         name: "",
//         email: "",
//         mobile_number: "",
//         institute_name: "",
//         branch: "",
//         designation: "",
//         role: "",
//         security_question: "",
//         security_answer: "",
//       });
//     }
//   }, [editingUser]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingUser) {
//         const cleanedData = Object.fromEntries(
//           Object.entries(formData).filter(([_, value]) => value !== "")
//         );
//         await axiosInstance.patch(`/login/users/${editingUser.ehrms_code}/`, cleanedData);
//         toast.success("User updated successfully");
//       } else {
//         await axiosInstance.post("/login/users/", formData);
//         toast.success("User added successfully");
//       }
//       onHide();
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save user");
//     }
//   };

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Form onSubmit={handleSubmit}>
//         <Modal.Header closeButton>
//           <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             {[
//               { label: "EHRMS Code", key: "ehrms_code" },
//               { label: "Name", key: "name" },
//               { label: "Email", key: "email", type: "email" },
//               { label: "Mobile", key: "mobile_number", type: "tel" },
//             ].map(({ label, key, type = "text" }) => (
//               <Col md={6} className="mb-3" key={key}>
//                 <Form.Label>{label}</Form.Label>
//                 <Form.Control
//                   type={type}
//                   required={!editingUser}
//                   value={formData[key] || ""}
//                   onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                   disabled={editingUser && key === "ehrms_code"}
//                 />
//               </Col>
//             ))}

//             <Col md={6} className="mb-3">
//               <Form.Label>Institute</Form.Label>
//               <Form.Select
//                 required={!editingUser}
//                 value={formData.institute_name || ""}
//                 onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
//               >
//                 <option value="">Select Institute</option>
//                 {polytechnics.map((inst, i) => (
//                   <option key={i} value={inst}>{inst}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col md={6} className="mb-3">
//               <Form.Label>Branch</Form.Label>
//               <Form.Select
//                 required={!editingUser}
//                 value={formData.branch || ""}
//                 onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
//               >
//                 <option value="">Select Branch</option>
//                 {branches.map((b, i) => (
//                   <option key={i} value={b}>{b}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col md={6} className="mb-3">
//               <Form.Label>Designation</Form.Label>
//               <Form.Select
//                 required={!editingUser}
//                 value={formData.designation || ""}
//                 onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
//               >
//                 <option value="">Select Designation</option>
//                 {designations.map((d, i) => (
//                   <option key={i} value={d}>{d}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col md={6} className="mb-3">
//               <Form.Label>Role</Form.Label>
//               <Form.Select
//                 required
//                 value={formData.role || ""}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//               >
//                 <option value="">Select Role</option>
//                 <option value="Admin">Admin</option>
//                 <option value="Coordinator">Coordinator</option>
//                 <option value="Trainer">Trainer</option>
//               </Form.Select>
//             </Col>

//             <Col md={6} className="mb-3">
//               <Form.Label>Security Question</Form.Label>
//               <Form.Control
//                 type="text"
//                 required={!editingUser}
//                 value={formData.security_question || ""}
//                 onChange={(e) => setFormData({ ...formData, security_question: e.target.value })}
//               />
//             </Col>

//             <Col md={6} className="mb-3">
//               <Form.Label>Security Answer</Form.Label>
//               <Form.Control
//                 type="text"
//                 required={!editingUser}
//                 value={formData.security_answer || ""}
//                 onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })}
//               />
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide}>Cancel</Button>
//           <Button type="submit" variant="primary">
//             {editingUser ? "Update User" : "Add User"}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default ManageUsers;


import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";
import { polytechnics } from "../data/polytechnics";
import { branches } from "../data/branches";
import designations from "../data/designations";
import DashboardLayout from "../components/DashboardLayout";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/login/users/");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  // const handleDelete = async (ehrms_code) => {
  //   try {
  //     await axiosInstance.delete(`/login/users/${ehrms_code}/`);
  //     toast.success("User deleted successfully");
  //     fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to delete user");
  //   }
  // };
  const handleDelete = async () => {
  if (!userToDelete) return;

  try {
    await axiosInstance.delete(`/login/users/${userToDelete.ehrms_code}/`);
    toast.success("User deleted successfully");
    fetchUsers();
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete user");
  } finally {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }
};


  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Manage Users</h3>
          <Button variant="primary" onClick={handleAdd}>Add User</Button>
        </div>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>EHRMS</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Institute</th>
              <th>Branch</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Security Question</th>
              <th>Security Answer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.ehrms_code}>
                <td>{idx + 1}</td>
                <td>{user.ehrms_code}</td>
                <td>{[user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ")}</td>
                <td>{user.email}</td>
                <td>{user.mobile_number}</td>
                <td>{user.institute_name}</td>
                <td>{user.branch}</td>
                <td>{user.designation}</td>
                <td>{user.role}</td>
                <td>{user.security_question}</td>
                <td>{user.security_answer}</td>
                <td className="align-middle">
                  {/* <div className="d-flex flex-column gap-1"> */}
                  <div className="d-flex gap-2 justify-content-center">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                    {/* <Button variant="danger" size="sm" onClick={() => handleDelete(user.ehrms_code)}>Delete</Button> */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setUserToDelete(user);
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

        <UserModal
          show={showModal}
          onHide={() => setShowModal(false)}
          editingUser={editingUser}
          fetchUsers={fetchUsers}
        />
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {userToDelete ? (
      <p>
        Are you sure you want to delete{" "}
        <strong>
          {userToDelete.first_name} {userToDelete.last_name}
        </strong>{" "}
        (EHRMS: {userToDelete.ehrms_code})? This action cannot be undone.
      </p>
    ) : (
      <p>Are you sure you want to delete this user?</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
      Cancel
    </Button>
    <Button variant="danger" onClick={handleDelete}>
      Yes, Delete
    </Button>
  </Modal.Footer>
</Modal>

    </DashboardLayout>
  );
};

const UserModal = ({ show, onHide, editingUser, fetchUsers }) => {
  const [formData, setFormData] = useState({
    ehrms_code: "",
    name: "",
    email: "",
    mobile_number: "",
    institute_name: "",
    branch: "",
    designation: "",
    role: "",
    security_question: "",
    security_answer: "",
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({ ...editingUser });
    } else {
      setFormData({
        ehrms_code: "",
        name: "",
        email: "",
        mobile_number: "",
        institute_name: "",
        branch: "",
        designation: "",
        role: "",
        security_question: "",
        security_answer: "",
      });
    }
  }, [editingUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        const cleanedData = Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== "")
        );
        await axiosInstance.patch(`/login/users/${editingUser.ehrms_code}/`, cleanedData);
        toast.success("User updated successfully");
      } else {
        await axiosInstance.post("/login/users/", formData);
        toast.success("User added successfully");
      }
      onHide();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
    }
  };

  return (

    <Modal show={show} onHide={onHide} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {[{ label: "EHRMS Code", key: "ehrms_code" },
            { label: "Name", key: "name" },
            { label: "Email", key: "email", type: "email" },
            { label: "Mobile", key: "mobile_number", type: "tel" }
            ].map(({ label, key, type = "text" }) => (
              <Col md={6} className="mb-3" key={key}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  required={!editingUser}
                  value={formData[key] || ""}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  disabled={editingUser && key === "ehrms_code"}
                />
              </Col>
            ))}

            <Col md={6} className="mb-3">
              <Form.Label>Institute</Form.Label>
              <Form.Select
                required={!editingUser}
                value={formData.institute_name || ""}
                onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
              >
                <option value="">Select Institute</option>
                {polytechnics.map((inst, i) => (
                  <option key={i} value={inst}>{inst}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Branch</Form.Label>
              <Form.Select
                required={!editingUser}
                value={formData.branch || ""}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                {branches.map((b, i) => (
                  <option key={i} value={b}>{b}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Designation</Form.Label>
              <Form.Select
                required={!editingUser}
                value={formData.designation || ""}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                <option value="">Select Designation</option>
                {designations.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                required
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Trainer">Trainer</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Security Question</Form.Label>
              <Form.Control
                type="text"
                required={!editingUser}
                value={formData.security_question || ""}
                onChange={(e) => setFormData({ ...formData, security_question: e.target.value })}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Security Answer</Form.Label>
              <Form.Control
                type="text"
                required={!editingUser}
                value={formData.security_answer || ""}
                onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })}
              />
            </Col>

          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">
            {editingUser ? "Update User" : "Add User"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>

  );
};

export default ManageUsers;
