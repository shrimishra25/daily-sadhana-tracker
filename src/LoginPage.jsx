import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '', // Added for registration
    fullName: '',
    counsellor: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Logic for Registration
      console.log("Registering User:", formData);
      alert("Registration Successful! Please Login.");
      setIsRegistering(false); // Move back to login mode
    } else {
      // Logic for Login (Using the admin/password for now)
      if (formData.username === 'admin' && formData.password === 'password') {
        onLogin(true);
        navigate('/dashboard');
      } else {
        alert('Invalid Credentials');
      }
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ color: '#5C6BC0' }}>
          {isRegistering ? 'Create Account' : 'Sadhana Tracker Login'}
        </h2>

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={styles.input}
            />
            <select required value={formData.counsellor}
                onChange={(e) => setFormData({...formData, counsellor: e.target.value})}
                style={styles.select}>
                    <option value="" disabled>Select Counsellor Name</option>
                    <option value="rsp">Rasayatra Prabhu</option>
                    {/* <option value="Counsellor 2">Counsellor 2</option>
                    <option value="Counsellor 3">Counsellor 3</option> */}
            </select>

          </>
        )}

        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            style={styles.toggleLink}
          >
            {isRegistering ? ' Login here' : ' Register here'}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    padding: '40px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '350px'
  },
  // Unified Input Style
  input: {
    display: 'block',
    width: '100%',
    margin: '12px 0',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '14px',
    height: '45px' // Fixed height for alignment
  },
  // NEW: Select style that matches Input exactly
  select: {
    display: 'block',
    width: '100%',
    margin: '12px 0',
    padding: '0 12px', // Vertical padding 0 because we use height
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '14px',
    height: '45px', // Must match input height
    backgroundColor: 'white',
    cursor: 'pointer',
    appearance: 'none', // Removes default browser arrow
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '14px'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#5C6BC0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px'
  },
  toggleLink: {
    color: '#5C6BC0',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '5px'
  }
};
export default LoginPage;