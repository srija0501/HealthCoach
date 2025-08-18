import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (user.id) {
      axios
        .get(`http://localhost:8080/application/dashboard/${user.id}`)
        .then((res) => {
          if (res.data.length > 0) {
            const app = res.data[0];
            setApplicationData(app);
            setFormData({
              fullName: app.fullName || "",
              phoneNumber: app.phoneNumber || "",
              address: app.address || "",
              experienceYears: app.experienceYears || 0,
            });
          }
        })
        .catch((err) => console.error("Error fetching application:", err));
    }
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experienceYears" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const saveProfile = () => {
    if (!applicationData) return;
    const updatePayload = {
      ...applicationData,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      experienceYears: formData.experienceYears,
    };
    axios
      .put(
        `http://localhost:8080/applications/${applicationData.id}`,
        updatePayload
      )
      .then((res) => {
        setApplicationData(res.data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating application:", err));
  };

  if (!applicationData) {
    return (
      <div className="profile-container">
        <div className="profile-overlay" />
        <div className="container text-center profile-loading">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3 text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="container ">
  <div className="card shadow-sm">
    <div className="card-body p-4">
      {/* Profile Picture / Welcome */}
      <div className="text-center mb-4">
        <h4 className="fw-bold text-success">
          Welcome, {applicationData.fullName || applicationData.applicantName}
        </h4>
        <p className="text-muted">{user.email}</p>
      </div>

      {/* Applicant Name (User) */}
      <div className="mb-3">
        <label className="form-label fw-bold">Applicant Name (User)</label>
        <input
          className="form-control"
          value={applicationData.applicantName || ""}
          disabled
        />
      </div>

      {/* Full Name & Phone + Program */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label fw-bold">Full Name</label>
          <input
            name="fullName"
            className="form-control"
            value={
              isEditing ? formData.fullName : applicationData.fullName || ""
            }
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label fw-bold">Phone Number</label>
          <input
            name="phoneNumber"
            className="form-control"
            value={
              isEditing
                ? formData.phoneNumber
                : applicationData.phoneNumber || ""
            }
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label fw-bold">Program</label>
          <input
            className="form-control"
            value={applicationData.program || "—"}
            disabled
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-3">
        <label className="form-label fw-bold">Address</label>
        <textarea
          name="address"
          className="form-control"
          rows={3}
          value={isEditing ? formData.address : applicationData.address || ""}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      {/* Years of Experience */}
      <div className="mb-3">
        <label className="form-label fw-bold">Years of Experience</label>
        <input
          type="number"
          name="experienceYears"
          className="form-control"
          value={
            isEditing
              ? formData.experienceYears
              : applicationData.experienceYears || 0
          }
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      {/* Submission Date */}
      <div className="mb-3">
        <label className="form-label fw-bold">Submission Date</label>
        <input
          className="form-control"
          value={
            applicationData.submissionDate
              ? new Date(applicationData.submissionDate).toLocaleString()
              : ""
          }
          disabled
        />
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="form-label fw-bold">Status</label>
        <input
          className="form-control"
          value={applicationData.status || ""}
          disabled
        />
      </div>

      {/* Documents */}
      <div className="mb-4">
        <label className="form-label fw-bold">Documents</label>
        <ul className="list-group">
          {applicationData.documents &&
          applicationData.documents.length > 0 ? (
            applicationData.documents.map((doc) => (
              <li
                key={doc.id || doc.fileName}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <a
                  href={`http://localhost:8080/documents/download/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-bold text-success"
                >
                  {doc.fileName}
                </a>
                <span className="badge bg-success">{doc.fileType}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              No documents uploaded
            </li>
          )}
        </ul>
      </div>
    </div>
  </div>
</div>


  );
}

export default ProfilePage;
