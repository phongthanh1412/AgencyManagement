import React, { useState } from 'react';
import '../App.css';

export default function Login({ onNavigate, onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Staff',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (role) => {
    setForm({ ...form, role });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract username from email (part before @)
    const username = form.email.includes('@') 
      ? form.email.split('@')[0] 
      : form.email;

    // Create user data object
    const userData = {
      username: username,
      email: form.email,
      role: form.role
    };

    // Call onLogin to authenticate and navigate
    onLogin(userData);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
          </div>
          <h1>Agency Management System</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="auth-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email or Username</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label>Login as</label>
              <div className="role-switch">
                <button
                  type="button"
                  className={`role-option ${form.role === 'Admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('Admin')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`role-option ${form.role === 'Staff' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('Staff')}
                >
                  Staff
                </button>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => onNavigate('signup')}
            >
              Go to Register
            </button>
          </div>
        </div>

        {/* <div className="page-footer">
          © 2025 Agency Management System
        </div> */}
      </div>
    </div>
  );
}
