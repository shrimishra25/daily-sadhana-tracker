import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SadhanaCard from './SadhanaCard.jsx';
import PreviousRecord from './PreviousRecord.jsx';
import CounsellorDashboard from './CounsellorDashboard.jsx'; // Make sure this is imported

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('username') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [userFullName, setUserFullName] = useState(localStorage.getItem('userFullName') || '');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

// Updated handler to accept the name from LoginPage
  const handleLoginSuccess = (status, role, fullName) => {
    setIsAuthenticated(status);

    if (role) setUserRole(role);
    if (fullName) setUserFullName(fullName);

    const storedName = localStorage.getItem('userFullName');
    setUserName(storedName || '');
  };

  const handleRecordSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Logout Logic
  const handleLogout = () => {
      localStorage.clear();
      setIsAuthenticated(false);
      setUserName('');
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={
          //!isAuthenticated ? <LoginPage onLogin={setIsAuthenticated} /> : <Navigate to="/dashboard" />
          !isAuthenticated ? <LoginPage onLogin={handleLoginSuccess} /> : <Navigate to="/dashboard" />
        } />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <div style={styles.dashboardContainer}>
                {/* Navigation Header */}
                <nav style={styles.nav}>
                  <h2 style={{ margin: 0, color: '#5C6BC0' }}>
                      {userRole === 'COUNSELLOR' ? 'Counsellor Portal' : 'Sadhana Tracker'} - {localStorage.getItem('userFullName')}
                      </h2>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                  </button>
                </nav>
                {userRole === 'COUNSELLOR' ? (
                  <CounsellorDashboard />
                ) : (
                <>
                <SadhanaCard onSaveSuccess={handleRecordSaved} />
                <PreviousRecord refresh={refreshTrigger} />
                </>
              )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* <Route
          path="/counsellor-dashboard"
          element={
            userRole === 'COUNSELLOR' ? <CounsellorDashboard /> : <Navigate to="/dashboard" />
          }
        /> */}

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '900px',
    backgroundColor: 'white',
    padding: '15px 25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  }
};

export default App;