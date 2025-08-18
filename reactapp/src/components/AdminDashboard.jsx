import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  getApplicationsByStatus,
  getStatusCounts,
  getApplicationsReport,
  updateApplicationStatus,
  addUser,
} from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#2c786c", "#51c4a7", "#ffb347", "#ff6b6b"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  // --- Users pagination state ---
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [reportData, setReportData] = useState([]);
  const [appFilter, setAppFilter] = useState("pending");
  const [activeChart, setActiveChart] = useState("bar");

  const [newReviewer, setNewReviewer] = useState({
    username: "",
    email: "",
    password: "",
    role: "REVIEWER",
  });

  useEffect(() => {
    if (activeTab === "users") loadUsers(currentPage);
    if (activeTab === "applications") loadApplicationsByStatus(appFilter);
    if (activeTab === "analytics") loadAnalytics();
  }, [activeTab, appFilter, currentPage]);

  // --- Load Users with Pagination ---
  const loadUsers = (page = 0) => {
    getAllUsers(page, pageSize)
      .then((res) => {
        setUsers(res.content || []);
        setTotalPages(res.totalPages || 0);
      })
      .catch(console.error);
  };

  const loadApplicationsByStatus = (status) => {
    getApplicationsByStatus(status).then(setApplications).catch(console.error);
  };

  const loadAnalytics = () => {
    getStatusCounts().then(setStatusCounts).catch(console.error);
    getApplicationsReport("2025-01-01", "2025-12-31")
      .then(setReportData)
      .catch(console.error);
  };

  const handleApplicationUpdate = (appId, status) => {
    updateApplicationStatus(appId, status)
      .then(() => loadApplicationsByStatus(appFilter))
      .catch(console.error);
  };

  const handleAddReviewer = async (e) => {
    e.preventDefault();
    try {
      const reviewerData = {
        name: newReviewer.username,
        email: newReviewer.email,
        password: newReviewer.password,
        role: "REVIEWER",
      };
      await addUser(reviewerData);
      alert("✅ Reviewer added successfully");
      setNewReviewer({
        username: "",
        email: "",
        password: "",
        role: "REVIEWER",
      });
      loadUsers(currentPage);
    } catch (err) {
      alert(
        "❌ Failed to add reviewer: " +
          (err.response?.data?.message || "Unknown error")
      );
    }
  };

  // ------------------ Render Tabs ------------------
  const renderContent = () => {
    switch (activeTab) {
      // ========== USERS ==========
      case "users":
        return (
          <div>
            <div className="d-flex align-items-center mb-4">
              <h3 className="mb-0 text-success">
                <i className="bi bi-people-fill me-2"></i> Manage Users
              </h3>
            </div>

            {/* Add Reviewer */}
            <div className="card p-3 mb-4 shadow-sm border-0 rounded-3">
              <h5 className="mb-3 text-secondary">Add Reviewer</h5>
              <form onSubmit={handleAddReviewer} className="row g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={newReviewer.username}
                    onChange={(e) =>
                      setNewReviewer({
                        ...newReviewer,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newReviewer.email}
                    onChange={(e) =>
                      setNewReviewer({ ...newReviewer, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={newReviewer.password}
                    onChange={(e) =>
                      setNewReviewer({
                        ...newReviewer,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-success w-100">
                    <i className="bi bi-person-plus"></i> Add Reviewer
                  </button>
                </div>
              </form>
            </div>

            {/* Users Table */}
            <div className="card shadow-sm border-0 rounded-3 p-3">
              <h6 className="mb-3 text-secondary">All Users</h6>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.username || u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              u.role === "ADMIN"
                                ? "primary"
                                : u.role === "REVIEWER"
                                ? "info text-dark"
                                : "secondary"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-outline-success btn-sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ⬅ Prev
                </button>

                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>

                <button
                  className="btn btn-outline-success btn-sm"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next ➡
                </button>
              </div>
            </div>
          </div>
        );

      // ========== APPLICATIONS ==========
      case "applications":
        return (
          <div>
            <div className="d-flex align-items-center mb-4">
              <h3 className="mb-0 text-success">
                <i className="bi bi-file-earmark-text me-2"></i> Applications
              </h3>
            </div>

            {/* Filters */}
            <div className="btn-group mb-3">
              {["pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  className={`btn ${
                    appFilter === status ? "btn-success" : "btn-outline-success"
                  }`}
                  onClick={() => setAppFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Applications Table */}
           {/* Applications Table */}
<div className="card shadow-sm border-0 rounded-3 p-3">
  <div className="table-responsive">
    <table className="table table-hover align-middle">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Applicant</th>
          <th>Program</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => (
          <tr key={app.id}>
            <td>{app.id}</td>
            <td>{app.applicantName || app.user?.username}</td>
            <td>{app.program || "N/A"}</td> {/* New Program Column */}
            <td>
              <span
                className={`badge ${
                  app.status === "pending"
                    ? "bg-warning text-dark"
                    : app.status === "approved"
                    ? "bg-success"
                    : "bg-danger"
                }`}
              >
                {app.status.toUpperCase()}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
          </div>
        );

      // ========== ANALYTICS ==========
      case "analytics":
        return (
          <div>
            <div className="d-flex align-items-center mb-4">
              <h3 className="mb-0 text-success">
                <i className="bi bi-bar-chart-fill me-2"></i> Analytics
              </h3>
            </div>

            {/* Chart toggle */}
            <div className="mb-4 d-flex gap-3">
              <button
                className={`btn ${
                  activeChart === "bar" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setActiveChart("bar")}
              >
                Monthly Applications
              </button>
              <button
                className={`btn ${
                  activeChart === "pie" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setActiveChart("pie")}
              >
                Status Distribution
              </button>
            </div>

            <div className="card shadow-sm border-0 rounded-3 p-3">
              {activeChart === "bar" && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="applications"
                      fill="#2c786c"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="approved"
                      fill="#51c4a7"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="rejected"
                      fill="#ff6b6b"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChart === "pie" && (
  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie
        data={Object.entries(statusCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }))}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={110}
        innerRadius={50}
        label={({ name, percent }) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
      >
        {Object.keys(statusCounts).map((_, i) => (
          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => [`${val}`, "Applications"]} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
)}
            </div>
          </div>
        );

      default:
        return <h3>Welcome Admin</h3>;
    }
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <nav
          className="col-md-2 col-lg-2 d-flex flex-column text-white p-4 min-vh-100 sticky-top shadow-sm"
          style={{
            zIndex: 1,
            background: "linear-gradient(180deg, #2c786c, #51c4a7)",
          }}
        >
          <div className="mb-4">
            <h4 className="fw-bold mb-0">Admin Panel</h4>
          </div>

          <ul className="nav nav-pills flex-column mb-auto gap-2">
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start btn btn-sm rounded-3 ${
                  activeTab === "analytics"
                    ? "bg-success text-white fw-bold"
                    : "btn-outline-light text-white"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                <i className="bi bi-bar-chart-fill me-2"></i> Analytics
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start btn btn-sm rounded-3 ${
                  activeTab === "users"
                       ? "bg-success text-white fw-bold"
                    : "btn-outline-light text-white"
                }`}
                onClick={() => setActiveTab("users")}
              >
                <i className="bi bi-people-fill me-2"></i> Manage Users
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link w-100 text-start btn btn-sm rounded-3 ${
                  activeTab === "applications"
                        ? "bg-success text-white fw-bold"
                    : "btn-outline-light text-white"
                }`}
                onClick={() => setActiveTab("applications")}
              >
                <i className="bi bi-file-earmark-text me-2"></i> Applications
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 col-lg-10 p-4">
          <div className="container-fluid">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
