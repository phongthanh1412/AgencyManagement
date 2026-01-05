import React, { useState } from 'react';
import '../App.css';
import { register } from '../services/authService';

export default function SignUp({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match!' });
      return;
    }
    if (form.password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    try {
      await register({
        username: form.fullName.replace(/\s+/g, '').toLowerCase(),
        email: form.email,
        password: form.password,
        role: form.role,
        fullName: form.fullName
      });

      setStatus({ type: 'success', message: `Successfully registered as ${form.role}! Redirecting to login...` });

      setTimeout(() => {
        onNavigate('login');
      }, 2000);

    } catch (error) {
      setStatus({ type: 'error', message: 'Registration failed: ' + error.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/company.png" alt="Company Logo" width="64" height="64" style={{ display: 'block', margin: '0 auto' }} />
          </div>
          <h1>Agency Management System</h1>
          <p>Create a new account</p>
        </div>

        <div className="auth-card">

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="input-group">
              <label>Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  minLength="6"
                  autoComplete="new-password"
                  required
                />
                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="submit-button">
              Register
            </button>
            {status.message && (
              <div style={{
                padding: '10px',
                marginTop: '15px',
                marginBottom: '0',
                borderRadius: '4px',
                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                textAlign: 'center'
              }}>
                {status.message}
              </div>
            )}
          </form>

          <div className="auth-footer">
            <p>Already have an account?</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('login')}
            >
              Back to Login
            </button>
          </div>
        </div>

        <div className="page-footer">
          © 2025 Agency Management System
        </div>
      </div>
    </div>
  );
}
