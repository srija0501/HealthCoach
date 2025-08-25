import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplicationStatus,
  viewDocument,
  downloadDocument,
} from "../api/api";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaFileAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaEye,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBriefcase,
  FaGraduationCap
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
        // Using SweetAlert for better notification
        Swal.fire({
          title: "Application Approved!",
          text: "The application has been successfully approved.",
          icon: "success",
          confirmButtonColor: "#2c786c",
          confirmButtonText: "OK"
        });
        navigate(-1);
      })
      .catch(() => {});
  };

  const handleReject = () => {
    updateApplicationStatus(id, "rejected", rejectionReason)
      .then(() => {
        // Using SweetAlert for better notification
        Swal.fire({
          title: "Application Rejected!",
          text: "The application has been rejected.",
          icon: "error",
          confirmButtonColor: "#2c786c",
          confirmButtonText: "OK"
        });
        setShowRejectModal(false);
        navigate(-1);
      })
      .catch(() => {});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="badge rounded-pill px-3 py-2 bg-success d-flex align-items-center">
            <FaCheckCircle className="me-1" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="badge rounded-pill px-3 py-2 bg-danger d-flex align-items-center">
            <FaTimesCircle className="me-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill px-3 py-2 bg-warning text-dark d-flex align-items-center">
            <FaClock className="me-1" /> Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 application-detail-container">
        <div className="text-center bg-white p-5 rounded-4 shadow-lg">
          <div
            className="spinner-border text-success mb-3"
            style={{ width: "3rem", height: "3rem" }}
          />
          <p className="text-muted fw-semibold mt-3">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-detail-container d-flex justify-content-center align-items-center">
        <div className="text-center bg-white p-5 rounded-4 shadow-lg">
          <div className="alert alert-danger shadow-sm px-4 py-3 rounded-4 d-inline-flex align-items-center">
            <FaTimesCircle className="me-2" size={"1.5rem"} />
            Application not found.
          </div>
          <button
            className="btn btn-success rounded-pill px-4 mt-4 d-inline-flex align-items-center"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="application-detail-container">
      {/* Background decorative elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

     <div className="container py-5">
  <div className="row justify-content-center">
    <div className="col-lg-8 col-xl-7">
      {/* Main card */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden main-card">
        {/* Header */}
        <div className="card-header d-flex align-items-center py-3 application-header position-relative">
          {/* Small back icon button */}
          <button
            className="btn btn-light btn-sm rounded-circle shadow-sm back-icon-btn position-absolute start-3 top-50 translate-middle-y"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft size="1rem" />
          </button>

          <div className="d-flex align-items-center justify-content-center w-100">
            <div className="application-icon bg-white rounded-circle d-flex align-items-center justify-content-center me-3">
              <FaUser size="1.2rem" />
            </div>
            <span className="fw-bold fs-4 text-white">Application Details</span>
          </div>

          {/* Status Badge */}
          {getStatusBadge(application.status)}
        </div>


              {/* Body */}
              <div className="card-body p-2">
                <div className="row g-4">
                  {/* Applicant Information */}
                  <div className="col-12">
                    <h5 className="section-title mb-1">
                      <FaUser className="me-2" /> Applicant Information
                    </h5>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-success me-2">
                          <FaUser size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Full Name:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.fullName}</div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-success me-2">
                          <FaUser size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Applicant Name:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.applicantName}</div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-info me-2">
                          <FaPhone size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Phone:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.phoneNumber}</div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-warning me-2">
                          <FaBriefcase size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Experience (Years):</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.experienceYears}</div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-primary me-2">
                          <FaMapMarkerAlt size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Address:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.address}</div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-purple me-2">
                          <FaGraduationCap size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Program:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">{application.program}</div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="info-card p-3 border-0 rounded-3 shadow-sm">
                      <div className="d-flex align-items-center mb-2">
                        <div className="icon-container bg-danger me-2">
                          <FaCalendarAlt size="0.8rem" />
                        </div>
                        <strong className="text-secondary">Submitted On:</strong>
                      </div>
                      <div className="mt-2 fw-semibold">
                        {new Date(application.submissionDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                {application.documents?.length > 0 && (
                  <div className="mt-5">
                    <h5 className="section-title mb-4">
                      <FaFileAlt className="me-2" /> Uploaded Documents
                    </h5>
                    <div className="row g-3">
                      {application.documents.map((doc, index) => (
                        <div className="col-12" key={index}>
                          <div className="document-card d-flex justify-content-between align-items-center p-3 border-0 rounded-3 shadow-sm">
                            <div className="d-flex align-items-center">
                              <div className="document-icon bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                                <FaFileAlt size="1rem" />
                              </div>
                              <span className="fw-medium">{doc.fileName}</span>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => viewDocument(doc.id)}
                                className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center"
                              >
                                <FaEye className="me-1" /> View
                              </button>
                              <button
                                onClick={() => downloadDocument(doc.id)}
                                className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center"
                              >
                                <FaDownload className="me-1" /> Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approve / Reject */}
                {application.status === "pending" && (
                  <div className="mt-5 pt-3 text-center">
                    <h5 className="section-title mb-4">Review Actions</h5>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <button
                        className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center action-btn"
                        onClick={handleApprove}
                      >
                        <FaCheckCircle className="me-2" /> Approve Application
                      </button>
                      <button
                        className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center action-btn"
                        onClick={() => setShowRejectModal(true)}
                      >
                        <FaTimesCircle className="me-2" /> Reject Application
                      </button>
                    </div>
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
            <div className="modal-content shadow-lg rounded-4 border-0">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <FaTimesCircle className="me-2" /> Reject Application
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted mb-3">
                  Please provide a reason for rejecting this application. This will be recorded and may be shared with the applicant.
                </p>
                <label className="form-label fw-semibold">
                  Reason for rejection:
                </label>
                <textarea
                  className="form-control shadow-sm rounded-3"
                  rows="4"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter detailed rejection reason..."
                ></textarea>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger rounded-pill px-4 d-flex align-items-center"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  <FaTimesCircle className="me-2" /> Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .application-detail-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #2c786c 0%, #51C4A7 100%);
          position: relative;
          overflow-x: hidden;
        }
        
        .background-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .background-shapes .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .shape-1 {
          height: 300px;
          width: 300px;
          top: -100px;
          right: -100px;
        }
        
        .shape-2 {
          height: 150px;
          width: 150px;
          bottom: 50px;
          left: -50px;
        }
        
        .shape-3 {
          height: 200px;
          width: 200px;
          bottom: -50px;
          right: 20%;
        }
        
        .shape-4 {
          height: 100px;
          width: 100px;
          top: 20%;
          left: 30%;
        }
        
        .main-card {
          border: none;
          z-index: 1;
          position: relative;
        }
        
        .application-header {
          background: linear-gradient(135deg, #2c786c 0%, #51C4A7 100%);
          border-bottom: none;
        }
        
        .application-icon {
          width: 40px;
          height: 40px;
        }
        
        .section-title {
          color: #2c786c;
          font-weight: 600;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }
        
        .info-card {
          background: #f8f9fa;
          transition: all 0.3s ease;
          height: 100%;
        }
        
        .info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
        }
        
      .icon-container,
.application-icon,
.document-icon {
  color: #2c786c !important;
  background-color: #ffffff !important;
}

/* Small back icon button */
.back-icon-btn {
  border: none;
  padding: 0.35rem;
  background: white;
  color: #2c786c;
  transition: all 0.3s ease;
}

.back-icon-btn:hover {
  background: #e9ecef;
  transform: translateX(-2px);
}
        
        .bg-purple {
          background-color: #6f42c1;
        }
        
        .document-card {
          background: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .document-card:hover {
          background: #e9ecef;
          transform: translateX(5px);
        }
        
        .document-icon {
          width: 40px;
          height: 40px;
        }
        
        .back-btn {
          background: white;
          border: none;
          transition: all 0.3s ease;
          z-index: 1;
          position: relative;
        }
        
        .back-btn:hover {
          background: #e9ecef;
          transform: translateX(-5px);
        }
        
        .action-btn {
          transition: all 0.3s ease;
          min-width: 200px;
          justify-content: center;
        }
        
        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        @media (max-width: 768px) {
          .action-btn {
            width: 100%;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}