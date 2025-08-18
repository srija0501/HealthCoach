import './App.css';
import HomePage from './components/HomePage';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ApplicationForm from './components/ApplicationForm';
import ApplicantDashboard from './components/ApplicantDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import ApplicationDetails from './components/ApplicationDetails';
import Guidelines from './components/Guidelines';

// NEW layout for applicant (with sidebar)
import ApplicantLayout from './components/ApplicantLayout';

function App() {
  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.id;
  };

  const getRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Applicant routes with sidebar layout */}
          <Route path="/applicant" element={<ApplicantLayout />}>
            <Route path="applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="apply" element={<ApplicationForm />} />
            <Route path="profile" element={<ProfilePage />} />
          
            <Route path="guidelines" element={<Guidelines />} />
          </Route>
            <Route path="application/:id" element={<ApplicationDetails />} />
          {/* Reviewer */}
          <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />

          {/* Admin */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
