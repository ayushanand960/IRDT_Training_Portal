
import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom"; // ✅ Add this line
import Header from '../components/Header';
import Footer from '../components/Footer';
import { polytechnics } from "../data/polytechnics";
import { securityQuestions } from "../data/securityQuestions";
import { branches } from "../data/branches";

 // ✅ Add this inside the Register component


const Register = () => {
  const [form, setForm] = useState({
    ehrms_code: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '', 
    mobile_number: '',
    gender: '', 
    institute_name: '',
    branch: '',
    designation: '',
    password: '',
    security_question: '',
    security_answer: '',
  });
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

     if (!strongPasswordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.");
      return;
    }

    console.log("Registering user:", {
    ...form,
    category: selectedCategory,
    designation: selectedDesignation,
  });

    try {
      await axiosInstance.post(
        "/login/register/",
        {
          ...form,
          category: selectedCategory,
          designation: selectedDesignation,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert("Registration successful");
    } catch (err) {
      const errorData = err.response?.data;
  console.error("Registration error response:", errorData); // for debugging

  let errorMsg = "Registration failed";

  if (typeof errorData === "string") {
    errorMsg = errorData;
  } else if (typeof errorData === "object" && errorData !== null) {
    const messages = [];

    // Recursive function to extract only message strings
    const extractMessages = (obj) => {
      for (const key in obj) {
        const val = obj[key];

        if (Array.isArray(val)) {
          val.forEach((msg) => {
            if (typeof msg === "string") messages.push(msg);
          });
        } else if (typeof val === "object" && val !== null) {
          extractMessages(val); // handle nested errors
        } else if (typeof val === "string") {
          messages.push(val);
        }
      }
    };

    extractMessages(errorData);

    if (messages.length > 0) {
      errorMsg = messages.join("\n");
    } else {
      errorMsg = errorData.detail || "Registration failed";
    }
  }

  setError(errorMsg);
  alert("Error:\n" + errorMsg);
    }
  };

  return (
    <div style={{ backgroundColor: '#c1e4f9', minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
      <button
  onClick={() => navigate('/')}
  className="btn btn-outline-dark btn-lg fw-semibold"
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 1000,
    fontSize: "1.1rem",
    padding: "6px 16px",
  }}
>
  🏠 Home
</button>


    <div className="container mt-5">
      <div className="card p-4 shadow" >
        <h3 className="text-center text-primary">Trainee Registration</h3>
        <p className="text-center mb-4">Create your IRDT Portal account</p>
        <form onSubmit={handleSubmit} className="row g-3 needs-validation" noValidate>
          <div className="col-md-6">
            <input type="text" name="ehrms_code" required onChange={handleChange} className="form-control" placeholder="EHRMS Code" />
          </div>

          <div className="col-md-6">
            <input type="text" name="first_name" required onChange={handleChange} className="form-control" placeholder="First Name" />
          </div>

          <div className="col-md-6">
            <input type="text" name="middle_name" onChange={handleChange} className="form-control" placeholder="Middle Name" />
          </div>

          <div className="col-md-6">
            <input type="text" name="last_name" required onChange={handleChange} className="form-control" placeholder="Last Name" />
          </div>

          <div className="col-md-6">
            <input type="email" name="email" required onChange={handleChange} className="form-control" placeholder="Email ID" />
          </div>

          <div className="col-md-6">
            <input type="tel" name="mobile_number" pattern="[0-9]{10}" required onChange={handleChange} className="form-control" placeholder="Mobile No."  />
          </div>

          <div className="col-md-6">
            <select name="gender" onChange={handleChange} required className="form-select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <select name="institute_name" onChange={handleChange} required className="form-select">
              <option value="">Select Polytechnic</option>
              {polytechnics.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <select name="branch" onChange={handleChange} required className="form-select">
              <option value="">Select Branch</option>
              {branches.map((branch, idx) => (
                <option key={idx} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedDesignation("");
              }}
              required
            >
              <option value="">Select Category</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              required
            >
              <option value="">Select Designation</option>
              {selectedCategory === 'A' && (
                <>
                  <option>Principal</option>
                  <option>HOD</option>
                </>
              )}
              {selectedCategory === 'B' && (
                <>
                  <option>Lecturer</option>
                  <option>Librarian</option>
                  <option>Workshop Superintendent</option>
                </>
              )}
              {selectedCategory === 'C' && (
                <>
                  <option>Workshop Instructor</option>
                  <option>Office Employee/Worker</option>
                  <option>Computer Instructor</option>
                  <option>Computer Operator</option>
                  <option>Others</option>
                </>
              )}
            </select>
          </div>

          <div className="col-md-6">
            <input
              type="password"
              name="password"
              required
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              onChange={(e) => {
                setPassword(e.target.value);
                setForm((prev) => ({ ...prev, password: e.target.value }));
              }}
              className="form-control"
              placeholder="Create Password"
            />
          </div>

          <div className="col-md-6">
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="Confirm Password"
            />
          </div>

          <div className="col-md-6">
            <select name="security_question" onChange={handleChange} required className="form-select">
              <option value="">Select Security Question</option>
              {securityQuestions.map((q, idx) => (
                <option key={idx} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <input type="text" name="security_answer" required onChange={handleChange} className="form-control" placeholder="Security Answer" />
          </div>

          {error && (
            <div className="col-md-12">
              <div className="alert alert-danger" role="alert">{error}</div>
            </div>
          )}

          <div className="col-md-12">
            <button type="submit" className="btn btn-primary w-100">Create Account</button>
          </div>

          <div className="col-md-12 text-center">
            <p className="mt-3">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Register;



