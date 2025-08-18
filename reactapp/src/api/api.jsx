import axios from "axios";

const API_BASE = "http://localhost:8080";

// ================== AUTH & USER APIs ==================
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API_BASE}/user/login`, credentials);
  return res.data;
};

export const addUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/user/add`, userData);
  return res.data;
};

export const getAllUsers = async (page = 0, size = 5) => {
  const res = await axios.get(`${API_BASE}/user/get`, {
    params: { page, size },
  });
  return res.data; // contains { content, totalPages, number, ... }
};
export const getUsersByRole = async (role) => {
  const res = await axios.get(`${API_BASE}/user/role/${role}`);
  return res.data;
};

export const updateUserProfile = async (id, updatedUser) => {
  const res = await axios.put(`${API_BASE}/user/${id}/profile`, updatedUser);
  return res.data;
};

// ------------------ Application APIs ------------------

// Get applications by status using filterByStatus endpoint
export const getApplicationsByStatus = async (status) => {
  const res = await axios.get(`${API_BASE}/application/filterByStatus`, {
    params: { status },
  });
  return res.data;
};

// ------------------ Applicant APIs ------------------

// Get applicant notifications
export const getApplicantNotifications = (userId) =>
  axios.get(`${API_BASE}/notification/user/${userId}`).then((res) => res.data);

// Check application status
export const getApplicationStatus = (userId) =>
  axios
    .get(`${API_BASE}/application/${userId}/application-status`, {
      responseType: "text",
    })
    .then((res) => res.data);

// Get full application (for profile page)
export const getApplicationById = (appId) =>
  axios.get(`${API_BASE}/application/${appId}`).then((res) => res.data);

// ------------------ Reviewer/Admin APIs ------------------

export const getReviewerNotifications = (reviewerId) =>
  axios.get(`${API_BASE}/notification/user/${reviewerId}`).then((res) => res.data);

export const getPendingApplications = () =>
  axios.get(`${API_BASE}/application/pending`).then((res) => res.data);

export const updateApplicationStatus = async (
  applicationId,
  status,
  rejectionReason = null
) => {
  try {
    const res = await axios.put(
      `${API_BASE}/application/${applicationId}/status`,
      { status, rejectionReason }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error updating application status",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getStatusCounts = async () => {
  const res = await axios.get(`${API_BASE}/application/status-counts`);
  return res.data;
};

// ------------------ Document APIs ------------------

// Upload documents for an application
export const uploadDocuments = async (applicationId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await axios.post(`${API_BASE}/documents/upload/${applicationId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};



// View a document in browser
export const viewDocument = (docId) => {
  window.open(`${API_BASE}/documents/view/${docId}`, "_blank");
};

// Download a document
export const downloadDocument = (docId) => {
  window.open(`${API_BASE}/documents/download/${docId}`, "_blank");
};



// ------------------ MOCK ONLY FOR REPORT ------------------
export const getApplicationsReport = async (startDate, endDate) => {
  console.warn("Using mock data for getApplicationsReport (backend missing)");
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { month: "Jan", applications: 12, approved: 8, rejected: 4 },
    { month: "Feb", applications: 18, approved: 12, rejected: 6 },
    { month: "Mar", applications: 25, approved: 20, rejected: 5 },
    { month: "Apr", applications: 10, approved: 6, rejected: 4 },
    { month: "May", applications: 30, approved: 22, rejected: 8 },
    { month: "Jun", applications: 15, approved: 10, rejected: 5 },
  ];
};
