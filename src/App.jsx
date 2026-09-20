import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddWorkoutPage from './pages/AddWorkoutPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <div className="app-wrapper">
            <Navbar />
            
            <main className="main-content-body">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage showToast={showToast} />} />
                <Route path="/login" element={<LoginPage showToast={showToast} />} />

                {/* Protected App Pages */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/history" element={<WorkoutHistoryPage showToast={showToast} />} />
                  <Route path="/add-workout" element={<AddWorkoutPage showToast={showToast} />} />
                  <Route path="/profile" element={<ProfilePage showToast={showToast} />} />
                </Route>

                {/* Fallback 404 Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <ToastNotification toast={toast} onClose={closeToast} />
          </div>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;
