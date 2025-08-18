import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./ApplicantDashboard.css"; // reuse your CSS

function ApplicantLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="applicant-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Health Coach Portal</h3>
          <div className="user-info">
            <div className="avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5>{user.name}</h5>
              <small>Applicant</small>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/applicant/applicant-dashboard")}>
            <i className="bi bi-house-door"></i> Dashboard
          </button>
          <button onClick={() => navigate("/applicant/apply")}>
            <i className="bi bi-file-earmark-plus"></i> Submit Application
          </button>
          <button onClick={() => navigate("/applicant/profile")}>
            <i className="bi bi-person-circle"></i> Manage Application
          </button>
          
          <button onClick={() => navigate("/applicant/guidelines")}>
            <i className="bi bi-journal-text"></i> Guidelines
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>

      {/* Main content placeholder */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ApplicantLayout;
