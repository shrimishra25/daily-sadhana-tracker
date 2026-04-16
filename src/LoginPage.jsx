import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    counsellor: ''
  });

  const navigate = useNavigate();
 // const [isCounsellorLogin, setIsCounsellorLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedValue = formData.counsellor;
    const assignedRole = selectedValue === "SELF_COUNSELLOR" ? "COUNSELLOR" : "COUNSELEE";
    if (isRegistering) {
      const payload = {
        username: formData.username,
        password: formData.password,
        emailMobile: formData.email,
        fullName: formData.fullName,
        counsellor: selectedValue,
        role: assignedRole
      };
      try {
        const response = await fetch('http://localhost:8080/authenticate/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Registration Successful! Please Login.");
          setIsRegistering(false);
        } else {
          const errorMsg = await response.text();
          alert("Registration failed: " + errorMsg);
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Network Error: Check if the backend is running and CORS is enabled.");
      }
    } else {
      const payload = {
        username: formData.username,
        password: formData.password
      };
      try {
        const response = await fetch('http://localhost:8080/authenticate/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();

            const assignedRole = data.role;

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userFullName', data.fullName);
            localStorage.setItem('userRole', assignedRole);
            onLogin(true, assignedRole, formData.fullName);

            navigate('/dashboard');
        } else {
          const errorMsg = await response.text();
          alert("Invalid Credentials: " + errorMsg);
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Network Error: Check if the backend is running and CORS is enabled.");
      }
    }
  }; // Removed the extra } that was here causing the issue

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>

          <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7JVPyPGIWh1KQAE14BjiQfgzUK2jcMTo1nw&s"
              alt="iskcon"
              style={styles.logo}
            />

        <h2 style={{ color: '#5C6BC0' }}>
          {isRegistering ? 'Create Account' : 'Sadhana Tracker Login'}
        </h2>

        <input
          type="text"
          placeholder="Enter Your User Name"
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={styles.input}
        />

        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Enter Your Full Name"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Enter Your Email / Mobile"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
            <select
              required
              value={formData.counsellor}
              onChange={(e) => setFormData({ ...formData, counsellor: e.target.value })}
              style={styles.select}
            >
              <option value="" disabled>Who is your Counsellor?</option>
              <option value="rsp">Rasayatra Prabhu</option>
              <option value="SELF_COUNSELLOR">I am a Counsellor</option>
            </select>
          </>
        )}

        <button type="submit" style={styles.button}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p style={{ marginTop: '15px', fontSize: '14px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => {
              setIsRegistering(!isRegistering);
              // Optional: Clear form when switching modes
              setFormData({ username: '', password: '', email: '', fullName: '', counsellor: '' });
            }}
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
  input: {
    display: 'block',
    width: '100%',
    margin: '12px 0',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '14px',
    height: '45px'
  },
  select: {
    display: 'block',
    width: '100%',
    margin: '12px 0',
    padding: '0 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '14px',
    height: '45px',
    backgroundColor: 'white',
    cursor: 'pointer',
    appearance: 'none',
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