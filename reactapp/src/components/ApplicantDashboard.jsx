import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplicantNotifications,
  getApplicationStatus,
} from "../api/api"; // adjust path

function ApplicantDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showStatus, setShowStatus] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user.id) return;
    setNotifLoading(true);
    try {
      const data = await getApplicantNotifications(user.id);
      const sorted = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check application status
  const checkApplicationSubmitted = async () => {
    if (!user.id) {
      setError("User ID not found. Please log in again.");
      return false;
    }
    setLoading(true);
    setError(null);
    setShowStatus(false);

    try {
      const status = (await getApplicationStatus(user.id)).toUpperCase();
      if (status === "NOT_SUBMITTED") {
        setApplicationStatus(null);
        alert("Application is not submitted yet.");
        return false;
      }
      setApplicationStatus(status);
      return true;
    } catch (err) {
      console.error("Error checking application submission:", err);
      setError("Error checking application status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToProfile = async () => {
    const submitted = await checkApplicationSubmitted();
    if (submitted) {
      navigate("/applicant/profile");
    }
  };

  const fetchStatus = async () => {
    const submitted = await checkApplicationSubmitted();
    if (submitted) setShowStatus(true);
  };

  const getStepStatus = (stepName) => {
    if (!applicationStatus) return "";
    const order = { PENDING: 1, APPROVED: 2, REJECTED: 2 };
    const stepOrder = {
      "Profile Created": 1,
      "Application Submitted": 2,
      Decision: 3,
    };
    const currentStep = order[applicationStatus] || 0;
    const thisStep = stepOrder[stepName];
    if (thisStep < currentStep) return "bg-success text-white";
    if (thisStep === currentStep) return "bg-warning text-dark";
    return "bg-secondary text-white";
  };

  return (
    <div className="container-fluid py-4">
      {/* Welcome Banner */}
      <div className="card border-start border-4  mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="text-success">
            Welcome back, {user.name || user.username}!
          </h2>
          <p>Manage your profile, submit applications, and track your progress here.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="mb-3">Quick Actions</h4>
        <div className="row g-3">
          <div
            className="col-md-3"
            onClick={() => navigate("/applicant/apply")}
          >
            <div className="card text-center shadow-sm p-3 h-100 clickable">
              <div className="bg-primary text-white rounded p-2 mx-auto mb-2">
                <i className="bi bi-file-earmark-plus fs-3"></i>
              </div>
              <h5>Submit Application</h5>
              <p className="text-muted small">
                Fill in details and upload required documents
              </p>
            </div>
          </div>

          <div className="col-md-3" onClick={goToProfile}>
            <div className="card text-center shadow-sm p-3 h-100 clickable">
              <div className="bg-success text-white rounded p-2 mx-auto mb-2">
                <i className="bi bi-person-lines-fill fs-3"></i>
              </div>
              <h5>Manage Application</h5>
              <p className="text-muted small">
                Update your personal and professional info
              </p>
            </div>
          </div>

          <div className="col-md-3" onClick={fetchStatus}>
            <div className="card text-center shadow-sm p-3 h-100 clickable">
              <div className="bg-warning text-white rounded p-2 mx-auto mb-2">
                <i className="bi bi-clipboard-data fs-3"></i>
              </div>
              <h5>Track Status</h5>
              <p className="text-muted small">
                Monitor your application’s progress
              </p>
            </div>
          </div>

          <div className="col-md-3" onClick={() => navigate("/applicant/guidelines")}>
            <div className="card text-center shadow-sm p-3 h-100 clickable">
              <div className="bg-info text-white rounded p-2 mx-auto mb-2">
                <i className="bi bi-journal-text fs-3"></i>
              </div>
              <h5>Guidelines</h5>
              <p className="text-muted small">
                View application process and tips
              </p>
            </div>
          </div>
        </div>
      </div>

    {/* Application Progress */}
{loading && <p>Loading status...</p>}
{error && <p className="text-danger">{error}</p>}
{showStatus && applicationStatus && (
  <div className="card mb-4 shadow-sm">
    <div className="card-body">
      {/* Status Header */}
      <h4
        className={`fw-bold ${
          applicationStatus === "APPROVED"
            ? "text-success"
            : applicationStatus === "REJECTED"
            ? "text-danger"
            : "text-warning"
        }`}
      >
        Application Status: {applicationStatus}
      </h4>

      {/* Stepper */}
      <div className="d-flex justify-content-between align-items-start mt-4">
        
        {/* Step 1 */}
        <div className="text-center flex-fill">
          <div
            className={`rounded-circle mx-auto mb-2 d-flex justify-content-center align-items-center 
              ${getStepStatus("Profile Created") === "completed" 
                ? "bg-success text-white" 
                : "bg-secondary text-white"}`}
            style={{ width: "50px", height: "50px" }}
          >
            1
          </div>
          <h6>Profile Created</h6>
        </div>

        {/* Connector */}
        <div className="flex-fill align-self-center border-top mx-2"></div>

        {/* Step 2 */}
        <div className="text-center flex-fill">
          <div
            className={`rounded-circle mx-auto mb-2 d-flex justify-content-center align-items-center 
              ${getStepStatus("Application Submitted") === "completed" 
                ? "bg-success text-white" 
                : "bg-secondary text-white"}`}
            style={{ width: "50px", height: "50px" }}
          >
            2
          </div>
          <h6>Application Submitted</h6>
        </div>

        {/* Connector */}
        <div className="flex-fill align-self-center border-top mx-2"></div>

        {/* Step 3 */}
        <div className="text-center flex-fill">
          <div
            className={`rounded-circle mx-auto mb-2 d-flex justify-content-center align-items-center 
              ${
                applicationStatus === "APPROVED"
                  ? "bg-success text-white"
                  : applicationStatus === "REJECTED"
                  ? "bg-danger text-white"
                  : "bg-warning text-dark"
              }`}
            style={{ width: "50px", height: "50px" }}
          >
            3
          </div>
          <h6>
            {applicationStatus === "APPROVED"
              ? "Approved"
              : applicationStatus === "REJECTED"
              ? "Rejected"
              : "Pending Review"}
          </h6>
        </div>

      </div>
    </div>
  </div>
)}

      {/* Notifications */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Recent Notifications</h4>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate("/applicant/notifications")}
            >
              View All
            </button>
          </div>

          {notifLoading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            <ul className="list-group">
              {notifications.slice(0, 5).map((notif) => (
                <li
                  key={notif.id}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <p className="mb-1">{notif.message}</p>
                    <small className="text-muted">
                      {new Date(notif.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <i className="bi bi-info-circle-fill text-primary"></i>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicantDashboard;
