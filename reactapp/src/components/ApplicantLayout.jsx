import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./ApplicantDashboard.css"; // Reuse your CSS

function ApplicantLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
console.log(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="applicant-dashboard d-flex">
      {/* Sidebar */}
      <div
        className="sidebar d-flex flex-column justify-content-between text-white p-3"
        style={{
          width: "250px",
          background: "linear-gradient(180deg, #2c786c, #51c4a7)",
          minHeight: "100vh",
        }}
      >
        {/* Top Section */}
        <div>
          <h3 className="mb-4">Health Coach Portal</h3>

          {/* User Info */}
          <div
            className="d-flex align-items-center p-2 rounded mb-4"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div
              className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px", fontWeight: "bold" }}
            >
              
             {user?user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ms-2">
              <h6 className="m-0">{user.name || "Applicant"}</h6>
              <small className="text-light">Applicant</small>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav list-group">
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/applicant-dashboard")}
            >
              <i className="bi bi-house-door me-2"></i> Dashboard
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/apply")}
            >
              <i className="bi bi-file-earmark-plus me-2"></i> Submit Application
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/profile")}
            >
              <i className="bi bi-person-circle me-2"></i> Manage Application
            </button>
            <button
              className="list-group-item list-group-item-action border-0"
              onClick={() => navigate("/applicant/guidelines")}
            >
              <i className="bi bi-journal-text me-2"></i> Guidelines
            </button>
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div>
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Main content placeholder */}
      <div className="main-content flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
}

export default ApplicantLayout;
