import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationById, updateApplicationStatus,viewDocument, downloadDocument  } from "../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFileAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleApprove = () => {
    updateApplicationStatus(id, "approved")
      .then(() => {
        alert("✅ Application approved!");
        navigate(-1);
      })
      .catch(() => {});
  };

  const handleReject = () => {
    updateApplicationStatus(id, "rejected", rejectionReason)
      .then(() => {
        alert("❌ Application rejected!");
        setShowRejectModal(false);
        navigate(-1);
      })
      .catch(() => {});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span
            className="badge rounded-pill px-3 py-2"
            style={{ background: "#28a745" }}
          >
            <FaCheckCircle className="me-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="badge rounded-pill bg-danger px-3 py-2">
            <FaTimesCircle className="me-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill bg-warning text-dark px-3 py-2">
            <FaClock className="me-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center bg-white bg-opacity-75 p-4 rounded-4 shadow-lg">
          <div
            className="spinner-border text-success mb-3"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted fw-semibold">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div
        className="container mt-5 text-center d-flex flex-column align-items-center justify-content-center vh-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="alert alert-danger shadow-sm d-inline-block px-4 py-3 mt-5 bg-white bg-opacity-80 rounded-4">
          <FaTimesCircle className="me-2" size={"1.2rem"} />
          Application not found.
        </div>
        <div className="mt-3">
          <button
            className="btn rounded-pill px-4"
            style={{
              background: "#218c71",
              color: "#fff",
              border: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-start pt-5"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for blur effect */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(0,0,0,0.3)" }}
      ></div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white bg-opacity-90">
              {/* Header */}
              <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  background: "#218c71",
                  color: "#fff",
                  fontSize: "1.2rem",
                }}
              >
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-light btn-sm me-3 rounded-pill px-3"
                    style={{
                      color: "#218c71",
                      fontWeight: 600,
                      background: "#f3fefa",
                      border: "1.5px solid #b5dfcc",
                    }}
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="me-1" /> Back
                  </button>
                  <span className="fw-bold">Application Details</span>
                </div>
                {getStatusBadge(application.status)}
              </div>

              {/* Body */}
              <div className="card-body" style={{ background: "#ffffff" }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Full Name:</strong>
                      <div className="mt-1">{application.fullName}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Applicant Name:</strong>
                      <div className="mt-1">{application.applicantName}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Phone:</strong>
                      <div className="mt-1">{application.phoneNumber}</div>
                    </div>
                    
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Experience (Years):</strong>
                      <div className="mt-1">{application.experienceYears}</div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Address:</strong>
                      <div className="mt-1">{application.address}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
  <div className="p-3 border rounded">
    <strong className="text-secondary">Program:</strong>
    <div className="mt-1">{application.program}</div>
  </div>
</div>
                  <div className="col-12">
                    <div className="p-3 border rounded">
                      <strong className="text-secondary">Submitted On:</strong>
                      <div className="mt-1">
                        {new Date(application.submissionDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
             {application.documents?.length > 0 && (
  <div className="mt-4">
    <h5 className="fw-bold text-dark border-bottom pb-2">
      Uploaded Documents
    </h5>
    <ul className="list-group list-group-flush">
      {application.documents.map((doc, index) => (
        <li
          className="list-group-item d-flex justify-content-between align-items-center my-2 rounded"
          style={{ background: "#f8fdfa", borderColor: "#b5dfcc" }}
          key={index}
        >
          <span>
            <FaFileAlt className="text-primary me-2" />
            {doc.fileName}
          </span>
          <div className="d-flex gap-2">
            {/* View */}
           <a
  onClick={() => viewDocument(doc.id)}
  className="btn btn-outline-primary btn-sm"
>
  View
</a>

<a
  onClick={() => downloadDocument(doc.id)}
  className="btn btn-outline-success btn-sm"
>
  Download
</a>

           
          </div>
        </li>
      ))}
    </ul>
  </div>
)}



                {/* Approve / Reject buttons */}
                {application.status === "pending" && (
                  <div className="mt-4 d-flex gap-3 justify-content-center">
                    <button
                      className="btn rounded-pill px-4"
                      style={{
                        background: "#2ca68d",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                      onClick={handleApprove}
                    >
                      <FaCheckCircle className="me-2" /> Approve
                    </button>
                    <button
                      className="btn rounded-pill px-4"
                      style={{
                        background: "#f06449",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                      onClick={() => setShowRejectModal(true)}
                    >
                      <FaTimesCircle className="me-2" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg rounded-4">
              <div
                className="modal-header"
                style={{ background: "#f06449", color: "#fff" }}
              >
                <h5 className="modal-title fw-bold">Reject Application</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label fw-semibold">
                  Reason for rejection:
                </label>
                <textarea
                  className="form-control shadow-sm"
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn rounded-pill px-4"
                  style={{ background: "#f06449", color: "#fff" }}
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
