import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import SadhanaCard from './SadhanaCard.jsx';
import PreviousRecord from './PreviousRecord.jsx';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

  // This function will run when a record is successfully saved in SadhanaCard
  const handleRecordSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<LoginPage onLogin={setIsAuthenticated} />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                  <SadhanaCard onSaveSuccess={handleRecordSaved} />
                  <PreviousRecord refresh={refreshTrigger} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  export default App;