import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplicantNotifications,
  getApplicationStatus,
} from "../api/api"; // adjust path
import "./ApplicantDashboard.css";

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
    if (thisStep < currentStep) return "completed";
    if (thisStep === currentStep) return "active";
    return "";
  };

  return (
    <div className="applicant-dashboard-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user.name || user.username}!</h2>
        <p>Manage your profile, submit applications, and track your progress here.</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-cards">
          <div className="action-card" onClick={() => navigate("/applicant/apply")}>
            <div className="icon-box bg-primary">
              <i className="bi bi-file-earmark-plus"></i>
            </div>
            <h5>Submit Application</h5>
            <p>Fill in details and upload required documents</p>
          </div>

          <div className="action-card" onClick={goToProfile}>
            <div className="icon-box bg-success">
              <i className="bi bi-person-lines-fill"></i>
            </div>
            <h5>Manage Application</h5>
            <p>Update your personal and professional info</p>
          </div>

          <div className="action-card" onClick={fetchStatus}>
            <div className="icon-box bg-warning">
              <i className="bi bi-clipboard-data"></i>
            </div>
            <h5>Track Status</h5>
            <p>Monitor your application’s progress</p>
          </div>

          <div className="action-card" onClick={() => navigate("/applicant/guidelines")}>
            <div className="icon-box bg-info">
              <i className="bi bi-journal-text"></i>
            </div>
            <h5>Guidelines</h5>
            <p>View application process and tips</p>
          </div>
        </div>
      </div>

      {/* Application Progress */}
      {loading && <p>Loading status...</p>}
      {error && <p className="text-danger">{error}</p>}
      {showStatus && applicationStatus && (
        <div className="progress-section">
          <div className="section-header">
            <h4
              className={`status-text ${
                applicationStatus === "APPROVED"
                  ? "status-approved"
                  : applicationStatus === "REJECTED"
                  ? "status-rejected"
                  : "status-pending"
              }`}
            >
              Application Status: {applicationStatus}
            </h4>
          </div>
          <div className="progress-container">
            <div className="progress-steps">
              <div className={`step ${getStepStatus("Profile Created")}`}>
                <div className="step-number">1</div>
                <div className="step-info"><h6>Profile Created</h6></div>
              </div>
              <div className={`step ${getStepStatus("Application Submitted")}`}>
                <div className="step-number">2</div>
                <div className="step-info"><h6>Application Submitted</h6></div>
              </div>
              <div className={`step ${getStepStatus("Decision")}`}>
                <div className="step-number">3</div>
                <div className="step-info">
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
        </div>
      )}

      {/* Notifications */}
      <div className="notifications-section">
        <div className="section-header">
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
          <div className="notification-list">
            {notifications.slice(0, 5).map((notif) => (
              <div key={notif.id} className="notification">
                <div className="notification-icon">
                  <i className="bi bi-info-circle-fill text-primary"></i>
                </div>
                <div className="notification-content">
                  <p>{notif.message}</p>
                  <small>{new Date(notif.timestamp).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No notifications found.</p>
        )}
      </div>
    </div>
  );
}

export default ApplicantDashboard;
