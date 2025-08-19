
import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { polytechnics } from "../data/polytechnics";
import { securityQuestions } from "../data/securityQuestions";
import { branches } from "../data/branches";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/irdt-logo.png";
import { Link, useNavigate } from "react-router-dom";

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
    date_of_joining: '',
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();


  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    let errorMsg = "";

    // Field-specific validations
    if (name === "first_name" || name === "last_name" || name === "middle_name") {
      if (/\d/.test(value)) errorMsg = "Name cannot contain numbers.";
    }

    if (name === "email") {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      if (!emailRegex.test(value.trim().toLowerCase())) {
        errorMsg = "Enter a valid email.";
      }
    }

    if (name === "mobile_number") {
      const mobileRegex = /^[6-9][0-9]{9}$/;
      if (!mobileRegex.test(value)) {
        errorMsg = "Enter a valid 10-digit number starting with 6-9.";
      }
    }

    if (name === "date_of_joining") {
      if (!value) {
        errorMsg = "Date of joining is required.";
      } else {
        const today = new Date().toISOString().split("T")[0];
        if (value > today) {
          errorMsg = "Date of joining cannot be in the future.";
        }
      }
    }


    if (name === "password") {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!strongPasswordRegex.test(value)) {
        errorMsg = "Weak password.";
      }
    }

    if (name === "confirmPassword" && value !== password) {
      errorMsg = "Passwords do not match.";
    }

    // Save field-specific error
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };



  const validateForm = () => {
    let errors = [];

    // Email validator function
    function isValidEmail(email) {
      const normalized = email.trim().toLowerCase();

      // Allowed modern TLDs
      const allowedTLDs = [
        "com", "org", "net", "edu", "gov", "mil", "in", "co", "io", "tech", "info"
      ];

      // Disallowed TLDs
      const blockedTLDs = [
        "cc", "su", "museum", "example", "invalid", "test", "tk", "ml", "ga", "cf", "gq", "ru", "work", "xyz", "top", "men", "loan", "win"
      ];

      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

      if (!emailRegex.test(normalized)) {
        return { valid: false, reason: "Enter a valid email address." };
      }

      const tld = normalized.split(".").pop();

      if (blockedTLDs.includes(tld)) {
        return { valid: false, reason: `Emails ending with '.${tld}' are not allowed.` };
      }

      if (!allowedTLDs.includes(tld)) {
        return { valid: false, reason: `TLD '.${tld}' is not in the allowed list.` };
      }



      return { valid: true };
    }

    // -------------------------
    // Existing field validations
    // -------------------------

    if (!form.ehrms_code.trim()) errors.push("EHRMS Code is required.");
    if (!form.first_name.trim()) errors.push("First name is required.");
    if (!form.date_of_joining) errors.push("Date of joining is required.");

    // Email check
    const emailCheck = isValidEmail(form.email);
    if (!emailCheck.valid) errors.push(emailCheck.reason);

    // Mobile number check (must start with 6-9 and be 10 digits)
    const mobileRegex = /^[6-9][0-9]{9}$/;
    if (!mobileRegex.test(form.mobile_number)) {
      errors.push("Enter a valid 10-digit mobile number starting with 6-9.");
    }

    if (!form.gender) errors.push("Gender is required.");
    if (!form.institute_name) errors.push("Institute name is required.");
    if (!form.branch) errors.push("Branch is required.");
    if (!selectedCategory) errors.push("Category is required.");
    if (!selectedDesignation) errors.push("Designation is required.");

    // Password strength
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      errors.push("Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.");
    }

    // Password match
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    if (!form.security_question) errors.push("Security question is required.");
    if (!form.security_answer.trim()) errors.push("Security answer is required.");

    return errors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

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
      navigate("/login");
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = "Registration failed";

      if (typeof errorData === "string") {
        errorMsg = errorData;
      } else if (typeof errorData === "object" && errorData !== null) {
        const messages = [];
        const extractMessages = (obj) => {
          for (const key in obj) {
            const val = obj[key];
            if (Array.isArray(val)) {
              val.forEach((msg) => {
                if (typeof msg === "string") messages.push(msg);
              });
            } else if (typeof val === "object" && val !== null) {
              extractMessages(val);
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
    <>
      {/* NAVBAR */}
      <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom" style={{ backgroundColor: "#006666" }}>
        <div className="d-flex align-items-center gap-3">
          <img src={logo} alt="IRDT Logo" style={{ height: "8vw", filter: "invert(1) brightness(2)" }} />
          <div>
            <h2 className="fw-bold mb-0" style={{ color: "white", marginLeft: "2in" }}>
              Institute for Research, Development & Training (IRDT)
            </h2>
            <big className="fw-semibold" style={{ color: "white", marginLeft: "2in" }}>
              Government of Uttar Pradesh
            </big>
          </div>
        </div>
        <Link to="/" className="btn btn-outline-light fw-semibold">Home</Link>
      </div>

      {/* FORM WRAPPER */}
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="bg-white shadow-lg rounded-4 px-5 py-4" style={{ maxWidth: "1000px", margin: "auto", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <h4 className="mb-1 text-left fw-bold" style={{ color: "#006666", fontSize: "1.8rem" }}>Trainee Registration</h4>
            <p className="text-left text-muted mb-4" style={{ fontSize: "1rem" }}>Create your IRDT Portal account</p>

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
              <div className="row g-3">
                {/* EHRMS Code */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">EHRMS Code <span className="text-danger">*</span></label>
                  <input type="text" name="ehrms_code" required onChange={handleChange} className="form-control input-dark" />
                </div>

                {/* First Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input type="text" name="first_name" placeholder="e.g. Ayush" required onChange={handleChange} className={`form-control input-dark ${fieldErrors.first_name ? "is-invalid" : ""}`} />
                  {fieldErrors.first_name && <div className="invalid-feedback">{fieldErrors.first_name}</div>}
                </div>

                {/* Middle Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Middle Name</label>
                  <input type="text" name="middle_name" placeholder="e.g. Kumar" onChange={handleChange} className={`form-control input-dark ${fieldErrors.middle_name ? "is-invalid" : ""}`} />
                  {fieldErrors.middle_name && <div className="invalid-feedback">{fieldErrors.middle_name}</div>}
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input type="text" name="last_name" placeholder="e.g. Singh" onChange={handleChange} className={`form-control input-dark ${fieldErrors.last_name ? "is-invalid" : ""}`} />
                  {fieldErrors.last_name && <div className="invalid-feedback">{fieldErrors.last_name}</div>}
                </div>

                {/* Email ID */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email ID <span className="text-danger">*</span></label>
                  <input type="email" name="email" placeholder="e.g. example@gmail.com" required onChange={handleChange} className={`form-control input-dark ${fieldErrors.email ? "is-invalid" : ""}`} />
                  {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                </div>

                {/* Mobile No. */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
                  <input type="tel" name="mobile_number" pattern="[0-9]{10}" placeholder="e.g. 9876543210" required onChange={handleChange} className={`form-control input-dark ${fieldErrors.mobile_number ? "is-invalid" : ""}`} />
                  {fieldErrors.mobile_number && <div className="invalid-feedback">{fieldErrors.mobile_number}</div>}
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender <span className="text-danger">*</span></label>
                  <select name="gender" onChange={handleChange} required className="form-select input-dark">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>

                {/* Select Polytechnic */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Polytechnic <span className="text-danger">*</span></label>
                  <select name="institute_name" onChange={handleChange} required className="form-select input-dark">
                    <option value="">Select Polytechnic</option>
                    {polytechnics.map((item, idx) => (
                      <option key={idx} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Select Branch */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Branch <span className="text-danger">*</span></label>
                  <select name="branch" onChange={handleChange} required className="form-select input-dark">
                    <option value="">Select Branch</option>
                    {branches.map((branch, idx) => (
                      <option key={idx} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category <span className="text-danger">*</span></label>
                  <select className="form-select input-dark" value={selectedCategory} onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedDesignation("");
                  }} required>
                    <option value="">Select Category</option>
                    <option value="A">Group A</option>
                    <option value="B">Group B</option>
                    <option value="C">Group C</option>
                  </select>
                </div>

                {/* Designation */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Designation <span className="text-danger">*</span></label>
                  <select className="form-select input-dark" value={selectedDesignation} onChange={(e) => setSelectedDesignation(e.target.value)} required>
                    <option value="">Select Designation</option>
                    {selectedCategory === 'A' && <><option>Principal</option><option>HOD</option></>}
                    {selectedCategory === 'B' && <><option>Lecturer</option><option>Librarian</option><option>Workshop Superintendent</option></>}
                    {selectedCategory === 'C' && <><option>Workshop Instructor</option><option>Office Employee/Worker</option><option>Computer Instructor</option><option>Computer Operator</option><option>Others</option></>}
                  </select>

                  {/* If user selects "Others" under Group C, show a text field */}
                  {selectedCategory === "C" && selectedDesignation === "Others" && (
                    <input
                      type="text"
                      placeholder="Enter your designation"
                      className="form-control input-dark mt-2"
                      value={form.designation}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, designation: e.target.value }))
                      }
                      required
                    />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Date of Joining <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_joining"
                    value={form.date_of_joining}
                    onChange={handleChange}
                    className={`form-control input-dark ${fieldErrors.date_of_joining ? "is-invalid" : ""}`}
                    required
                  />
                  {fieldErrors.date_of_joining && (
                    <div className="invalid-feedback">{fieldErrors.date_of_joining}</div>
                  )}
                </div>


                {/* Password Fields */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Create Password <span className="text-danger">*</span></label>
                  <input type="password" name="password" required pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" onChange={(e) => {
                    setPassword(e.target.value);
                    setForm((prev) => ({ ...prev, password: e.target.value }));
                  }} className="form-control input-dark" />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
                  <input type="password" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} className="form-control input-dark" />
                </div>

                {/* Security Question */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Security Question <span className="text-danger">*</span></label>
                  <select name="security_question" onChange={handleChange} required className="form-select input-dark">
                    <option value="">Select Security Question</option>
                    {securityQuestions.map((q, idx) => (
                      <option key={idx} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                </div>

                {/* Security Answer */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Security Answer <span className="text-danger">*</span></label>
                  <input type="text" name="security_answer" required onChange={handleChange} className="form-control input-dark" />
                </div>

                {/* Error Display */}
                {error && (
                  <div className="col-md-12 mb-3">
                    <div className="alert alert-danger" role="alert">{error}</div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="col-md-12 mt-3">
                  <button type="submit" className="btn btn-success w-100 btn-lg"
                    disabled={
                      selectedCategory === "C" &&
                      selectedDesignation === "Others" &&
                      !form.designation.trim()
                    }
                  >Create Account</button>
                </div>

                {/* Login Link */}
                <div className="col-md-12 text-center mt-3">
                  <p className="text-muted" style={{ color: "#006666" }}>
                    Already have an account? <a href="/login" className="text-decoration-none" style={{ color: "#006666" }}>Login</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS Styling */}
      <style>
        {`
        .input-dark {
          color: #333;
          background-color: #f8f9fa;
          border: 1px solid #ccc;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .input-dark:focus {
          border-color: #006666;
          box-shadow: 0 0 5px rgba(0, 102, 102, 0.5);
          outline: none;
        }

        .form-label {
          font-weight: 600;
          text-align: left;
          display: block;
          font-size: 1rem;
        }

        .form-select {
          color: #333;
          background-color: #f8f9fa;
          border-radius: 10px;
          font-size: 1rem;
        }

        .form-select:focus {
          border-color: #006666;
          box-shadow: 0 0 5px rgba(0, 102, 102, 0.5);
        }

        .btn {
          border-radius: 10px;
          font-size: 1.1rem;
          padding: 12px;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background-color: #004d4d;
        }

        .text-danger {
          color: #e74c3c;
        }

        .btn-success {
          background-color: #28a745;
        }

        .btn-success:hover {
          background-color: #218838;
        }

        .is-invalid {
          border: 2px solid #e74c3c !important;
          background-color: #fdd !important;
        }
        .invalid-feedback {
          color: #e74c3c;
          font-size: 0.875rem;
        }


        .alert-danger {
          border-radius: 5px;
        }
      `}
      </style>
    </>
  );



};
export default Register;