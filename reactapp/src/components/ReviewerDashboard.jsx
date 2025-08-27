import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  getReviewerNotifications,
  getPendingApplications,
  getStatusCounts,
  updateApplicationStatus,
  getApplicationById
} from "../api/api"; 

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const user =
    JSON.parse(localStorage.getItem("user")) || { id: 1, name: "Reviewer" };

  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Pagination states
  const [notifPage, setNotifPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const notifPerPage = 2;
  const pendingPerPage = 2;

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!user.id) return;

    // Fetch stats
    getStatusCounts()
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching status counts", err));

    // Fetch notifications
    getReviewerNotifications(user.id)
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications", err));

    // Fetch pending applications
    getPendingApplications()
      .then((data) => setPendingApplications(data))
      .catch((err) => console.error("Error fetching pending applications", err));
  }, [user.id]);

  const handleApprove = async (appId) => {
    try {
      await updateApplicationStatus(appId, "APPROVED");
      setPendingApplications((prev) => prev.filter((app) => app.id !== appId));
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Application has been approved",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      Swal.fire("Error", "Failed to approve application", "error");
    }
  };

  const handleView = async (id) => {
    try {
      const app = await getApplicationById(id);
      localStorage.setItem("currentApplication", JSON.stringify(app));
      navigate(`/application/${id}`);
    } catch (err) {
      console.error("Error fetching application", err);
      Swal.fire("Error", "Failed to load application details", "error");
    }
  };

  const handleReject = async (appId) => {
    const { value: reason } = await Swal.fire({
      title: "Rejection Reason",
      input: "textarea",
      inputPlaceholder: "Enter the reason for rejection...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#dc3545",
    });

    if (reason) {
      try {
        await updateApplicationStatus(appId, "REJECTED", reason);
        setPendingApplications((prev) => prev.filter((app) => app.id !== appId));
        Swal.fire({
          icon: "success",
          title: "Application Rejected",
          text: "Rejection reason has been saved",
          confirmButtonColor: "#28a745",
        });
      } catch (err) {
        console.error("Error rejecting application", err);
        Swal.fire("Error", "Failed to reject application", "error");
      }
    }
  };

  // Get start and end of current week
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  // Filter notifications for this week
  const weeklyNotifications = notifications.filter((n) => {
    if (!n.timestamp) return false;
    const notifDate = Array.isArray(n.timestamp)
      ? new Date(
          n.timestamp[0],
          n.timestamp[1] - 1,
          n.timestamp[2],
          n.timestamp[3] || 0,
          n.timestamp[4] || 0,
          n.timestamp[5] || 0
        )
      : new Date(n.timestamp);
    return notifDate >= firstDayOfWeek && notifDate <= lastDayOfWeek;
  });

  // Pagination logic
  const filteredPending = pendingApplications.filter((app) =>
    searchTerm
      ? app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.program.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  const totalPendingPages = Math.ceil(filteredPending.length / pendingPerPage);
  const totalNotifPages = Math.ceil(weeklyNotifications.length / notifPerPage);

  const pagedPending = filteredPending.slice(
    (pendingPage - 1) * pendingPerPage,
    pendingPage * pendingPerPage
  );

  const pagedNotifications = weeklyNotifications.slice(
    (notifPage - 1) * notifPerPage,
    notifPage * notifPerPage
  );

  return (
    <div className="d-flex reviewer-dashboard">
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button 
          className="btn sidebar-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1050,
            backgroundColor: '#2c786c',
            color: 'white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className={`bi bi-${isSidebarOpen ? 'x' : 'list'}`}></i>
        </button>
      )}

      {/* Sidebar */}
    <div
  className={`text-white p-3 d-flex flex-column sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
  style={{
    width: isMobile ? (isSidebarOpen ? '450px' : '0') : (isSidebarOpen ? '250px' : '80px'),
    maxHeight: '100vh', // prevents it from exceeding viewport
    overflowY: 'auto',   // allows scrolling if content is taller than viewport
    transition: 'width 0.3s ease',
    background: "linear-gradient(180deg, #168c4dff, #179072ff)",
    position: isMobile ? 'fixed' : 'relative',
    zIndex: 1040,
  }}
>
  <div style={{ flex: '1 1 auto' }}>
    <h4 className="mb-3" style={{ display: isSidebarOpen ? 'block' : 'none' }}>
      Reviewer Portal
    </h4>
    <h4 className="mb-4 text-center" style={{ display: !isSidebarOpen ? 'block' : 'none' }}>
      <i className="bi bi-clipboard-check"></i>
    </h4>

    <div className="list-group">
            <button className="list-group-item list-group-item-action border-0 active bg-success text-white d-flex align-items-center">
              <i className="bi bi-speedometer2 me-2"></i>
              <span style={{ display: isSidebarOpen ? 'inline' : 'none' }}>Dashboard</span>
            </button>
            <div
              className="d-flex align-items-center p-2 rounded mt-2 sidebar-item"
              style={{ cursor: "pointer" }}
              onClick={() => alert("Help Clicked")}
            >
              <i className="bi bi-question-circle me-2"></i>
              <span style={{ display: isSidebarOpen ? 'inline' : 'none' }}>Help</span>
            </div>
            <div
              className="d-flex align-items-center p-2 rounded sidebar-item"
              style={{ cursor: "pointer" }}
              onClick={() => alert("Settings Clicked")}
            >
              <i className="bi bi-gear me-2"></i>
              <span style={{ display: isSidebarOpen ? 'inline' : 'none' }}>Settings</span>
            </div>
          </div>
        </div>

        {/* Profile + Logout */}
        <div>
          <div
            className="d-flex align-items-center p-2 rounded mb-3"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div
              className="bg-danger text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px", fontWeight: "bold" }}
            >
              {user.name?.charAt(0).toUpperCase() || "R"}
            </div>
            <div className="ms-2" style={{ display: isSidebarOpen ? 'block' : 'none' }}>
              <h6 className="m-0">{user.name || "Reviewer"}</h6>
              <small className="text-light">Regular Reviewer</small>
            </div>
          </div>

          <button
            className="logout-btn w-100 d-flex align-items-center"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            <span style={{ display: isSidebarOpen ? 'inline' : 'none' }}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-grow-1 p-4 main-content" 
        style={{ 
          backgroundColor: "#f8f9fa",
          marginLeft: isMobile ? 0 : (isSidebarOpen ? '0' : '0'),
          transition: 'margin-left 0.3s ease',
          width: isMobile ? '100%' : (isSidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 80px)')
        }}
      >
        {/* Welcome */}
        <div className="mb-3">
          <h2 className="text-success">
            Welcome back, {user.name || "Reviewer"}!
          </h2>
          <p className="text-muted">
            Manage and review pending applications efficiently
          </p>
        </div>

       {/* Stats */}
<div className="row g-3 mb-3 justify-content-center">
  <div className="col-lg-3 col-md-4 col-sm-6">
    <div className="card text-center shadow-sm border-0 stats-card">
      <div className="card-body">
        <div className="stats-icon bg-warning">
          <i className="bi bi-clock-history text-white"></i>
        </div>
        <h5 className="text-muted mt-2">Pending Reviews</h5>
        <h2 className="text-warning">{stats.pending || 0}</h2>
      </div>
    </div>
  </div>
  <div className="col-lg-3 col-md-4 col-sm-6">
    <div className="card text-center shadow-sm border-0 stats-card">
      <div className="card-body">
        <div className="stats-icon bg-success">
          <i className="bi bi-check-circle text-white"></i>
        </div>
        <h5 className="text-muted mt-2">Approved</h5>
        <h2 className="text-success">{stats.approved || 0}</h2>
      </div>
    </div>
  </div>
  <div className="col-lg-3 col-md-4 col-sm-6">
    <div className="card text-center shadow-sm border-0 stats-card">
      <div className="card-body">
        <div className="stats-icon bg-danger">
          <i className="bi bi-x-circle text-white"></i>
        </div>
        <h5 className="text-muted mt-2">Rejected</h5>
        <h2 className="text-danger">{stats.rejected || 0}</h2>
      </div>
    </div>
  </div>
</div>


        {/* Pending Applications */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="text-success m-0">Pending Applications</h4>

            <div className="d-flex gap-2 flex-wrap">
              <div className="search-container position-relative">
                <i className="bi bi-search position-absolute search-icon"></i>
                <input
                  type="text"
                  className="form-control ps-4"
                  placeholder="Search by name or program..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPendingPage(1);
                  }}
                  style={{ maxWidth: "250px" }}
                />
              </div>
              <select
                className="form-select w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="today">Submitted Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover shadow-sm bg-white rounded">
              <thead className="table-success">
                <tr>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Submission Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPending.length > 0 ? (
                  pagedPending.map((app) => (
                    <tr key={app.id}>
                      <td title={`Email: ${app.email}\nPhone: ${app.phone}`}>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-2">
                            {app.applicantName?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <div>
                            {app.applicantName}
                            <small className="d-block text-muted">{app.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{app.program}</td>
                      <td>{app.submissionDate}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm action-btn"
                            onClick={() => handleView(app.id)}
                          >
                            <i className="bi bi-eye"></i>
                            <span className="d-none d-md-inline ms-1">View</span>
                          </button>
                          <button
                            className="btn btn-success btn-sm action-btn"
                            onClick={() => handleApprove(app.id)}
                          >
                            <i className="bi bi-check-lg"></i>
                            <span className="d-none d-md-inline ms-1">Approve</span>
                          </button>
                          <button
                            className="btn btn-danger btn-sm action-btn"
                            onClick={() => handleReject(app.id)}
                          >
                            <i className="bi bi-x-lg"></i>
                            <span className="d-none d-md-inline ms-1">Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <i className="bi bi-inbox display-4 d-block text-muted mb-2"></i>
                      <span className="text-muted">No pending applications</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pending Applications Pagination */}
          {totalPendingPages > 1 && (
            <div className="d-flex justify-content-center mt-1">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pendingPage === 1}
                onClick={() => setPendingPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="align-self-center">
                Page {pendingPage} of {totalPendingPages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={pendingPage === totalPendingPages}
                onClick={() => setPendingPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
       {/* Notifications */}
<div className="notifications-section card shadow-sm border-0">
  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
    <h5 className="m-0 text-success">
      <i className="bi bi-bell me-2"></i>
      Notifications (This Week)
    </h5>

    {/* Pagination moved here */}
    {totalNotifPages > 1 && (
      <div className="d-flex gap-1 align-items-center">
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={notifPage === 1}
          onClick={() => setNotifPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>Page {notifPage} of {totalNotifPages}</span>
        <button
          className="btn btn-sm btn-outline-secondary"
          disabled={notifPage === totalNotifPages}
          onClick={() => setNotifPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    )}
  </div>

  <div className="card-body">
    {pagedNotifications.length > 0 ? (
      <div className="list-group">
        {pagedNotifications.map((n, index) => (
          <div key={index} className="list-group-item border-0 mb-2 rounded notification-item">
            <div className="d-flex align-items-center">
              <div className="bg-success rounded-circle p-2 me-3">
                <i className="bi bi-info-circle text-white"></i>
              </div>
              <div className="flex-grow-1">
                <p className="mb-0">{n.message || "No message provided"}</p>
                <small className="text-muted">
                  {n.timestamp
                    ? (Array.isArray(n.timestamp)
                        ? new Date(
                            n.timestamp[0],
                            n.timestamp[1] - 1,
                            n.timestamp[2],
                            n.timestamp[3] || 0,
                            n.timestamp[4] || 0,
                            n.timestamp[5] || 0
                          )
                        : new Date(n.timestamp)
                      ).toLocaleString()
                    : ""}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-3">
        <i className="bi bi-bell-slash display-4 d-block text-muted mb-2"></i>
        <span className="text-muted">No notifications this week</span>
      </div>
    )}
  </div>

        </div>
      </div>
            <style jsx>{`
        .reviewer-dashboard {
          min-height: 100vh;
        }
        
        .sidebar {
          box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
          height: 100vh;
        }
        
        .sidebar-item:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 10px;
          border-radius: 5px;
          transition: all 0.3s;
        }
        
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
       
        
        .stats-card:hover {
          transform: translateY(-5px);
        }
        

        .search-container {
          position: relative;
        }
        
        .search-icon {
          left: 10px;
          top: 10px;
          color: #6c757d;
        }
        
        .action-btn {
          border-radius: 20px;
          padding: 0.25rem 0.75rem;
        }
        
        .notification-item {
          background-color: #f8f9fa;
          transition: background-color 0.3s;
        }
        
        .notification-item:hover {
          background-color: #e9ecef;
        }
        
        .avatar-sm {
          width: 40px;
          height: 40px;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem !important;
          }
          
          .stats-card {
  transition: transform 0.3s;
  border-radius: 10px;
  min-width: 150px; /* shrink the card */
  max-width: 220px; /* limit max width */
  margin: 0 auto; /* center inside column */
}

.stats-icon {
  width: 40px;
  height: 40px;
}
            
        }
      `}</style>

    </div>
  );
}
