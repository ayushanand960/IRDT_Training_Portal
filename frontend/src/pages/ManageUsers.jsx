// src/pages/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import institutes from "../data/polytechnics";
import branches from "../data/branches";
import designations from "../data/designations";


const ManageUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      ehrms: "123456",
      name: "Dr. Rajesh Kumar",
      email: "rajesh@example.com",
      mobile: "9876543210",
      institute: "IRDT Lucknow",
      branch: "CSE",
      designation: "Professor",
      role: "Admin"
    },
    {
      id: 2,
      ehrms: "654321",
      name: "Prof. Sunita Singh",
      email: "sunita@example.com",
      mobile: "9876501234",
      institute: "IRDT Lucknow",
      branch: "ECE",
      designation: "HOD",
      role: "Coordinator"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id}>
              <td>{idx + 1}</td>
              <td>{user.ehrms}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>{user.institute}</td>
              <td>{user.branch}</td>
              <td>{user.designation}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editingUser={editingUser}
        setUsers={setUsers}
        users={users}
      />
    </div>
  );
};

const UserModal = ({ show, onHide, editingUser, users, setUsers }) => {
  const [formData, setFormData] = useState({
    ehrms: "",
    name: "",
    email: "",
    mobile: "",
    institute: "",
    branch: "",
    designation: "",
    role: ""
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({ ...editingUser });
    } else {
      setFormData({
        ehrms: "",
        name: "",
        email: "",
        mobile: "",
        institute: "",
        branch: "",
        designation: "",
        role: ""
      });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...editingUser, ...formData } : u
      );
      setUsers(updatedUsers);
    } else {
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers([...users, newUser]);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <Form.Group className="mb-3 col-md-6">
              <Form.Label>EHRMS Code</Form.Label>
              <Form.Control
                required
                value={formData.ehrms}
                onChange={(e) => setFormData({ ...formData, ehrms: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                required
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Institute</Form.Label>
              <Form.Select
                required
                value={formData.institute}
                onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
              >
                <option value="">Select Institute</option>
                {institutes.map((inst, idx) => (
                  <option key={idx} value={inst}>{inst}</option>
                ))}
              </Form.Select>
            </Form.Group>
<Form.Group className="mb-3 col-md-6">
  <Form.Label>Branch</Form.Label>
  <Form.Select
    required
    value={formData.branch}
    onChange={(e) =>
      setFormData({ ...formData, branch: e.target.value })
    }
  >
    <option value="">Select Branch</option>
    {branches.map((b, i) => (
      <option key={i} value={b}>{b}</option>
    ))}
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3 col-md-6">
  <Form.Label>Designation</Form.Label>
  <Form.Select
    required
    value={formData.designation}
    onChange={(e) =>
      setFormData({ ...formData, designation: e.target.value })
    }
  >
    <option value="">Select Designation</option>
    {designations.map((d, i) => (
      <option key={i} value={d}>{d}</option>
    ))}
  </Form.Select>
</Form.Group>

            <Form.Group className="mb-3 col-md-6">
              <Form.Label>Role</Form.Label>
              <Form.Select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Trainer">Trainer</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">
            {editingUser ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ManageUsers;
