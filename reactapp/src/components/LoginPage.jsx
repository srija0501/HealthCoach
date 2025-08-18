import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        email,
        password,
      });

      if (response.data && response.data.id && response.data.role) {
        setSuccessMessage("Login successful!");
        
        // Normalize role to uppercase to ensure consistency
        const userData = {
          ...response.data,
          role: response.data.role.toUpperCase()
        };
        console.log("Login response user:", response.data);
//localStorage.setItem("user", JSON.stringify(res.data));
        // Store only the user object
        localStorage.setItem("user", JSON.stringify(userData));

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Navigate based on normalized role
        switch (userData.role) {
          case "APPLICANT":
            navigate("/applicant/applicant-dashboard");
            break;
          case "REVIEWER":
            navigate("/reviewer-dashboard");
            break;
          case "ADMIN":
            console.log("Navigating to admin dashboard");
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };
  return (
    <div
      className="container mt-5 d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card p-4 shadow" style={{ maxWidth: "380px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don't have an account? <a href="/register">Register here</a>
          </small>
        </div>
      </div>
    </div>
  );
}
