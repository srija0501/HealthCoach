import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();
  
  try {
    const response = await axios.post("http://localhost:8080/user/register", {
      name,
      email,
      password,
      role: "APPLICANT" // Ensure role is included if required
    });

    console.log("Registered:", response.data);
    window.location.href = "/login";
  } catch (error) {
    console.error("Registration failed", error);
    // Show detailed error message from backend
    alert(error.response?.data?.message || "Registration failed. Please try again.");
  }
};
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card shadow-sm p-4" style={{ width: "350px" }}>
          <h3 className="text-center mb-4">Register</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
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
              <label className="form-label">Password</label>
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
              Register
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
