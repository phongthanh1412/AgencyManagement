import React from "react";
import Sidebar from "./Sidebar";
import "../App.css";

function Layout({ currentPage, user, onLogout, onNavigate, children }) {
  return (
    <div className="dashboard-container">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} user={user} />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
          </div>
          <div className="dashboard-user">
            <div className="notification-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#64748b">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
              <span className="notification-badge">1</span>
            </div>
            <div className="user-avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#6366f1">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="user-info">
              <div className="user-name">{user?.fullName || user?.username || 'User'}</div>
              <div className="user-role">Role: {user?.role?.toUpperCase() || 'STAFF'}</div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
