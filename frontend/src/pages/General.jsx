import React from "react";
import MasterLayout from "../components/Layout";
import "../App.css";

function General({ user, onLogout, onNavigate }) {
  return (
    <MasterLayout currentPage="general" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Welcome to Agency Management System</h1>
        <p>Select a module from the sidebar to get started</p>
      </div>
      
      <div className="welcome-card">
        <div className="welcome-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#6366f1">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7V8.3l7-3.11 7 3.11V13c0 4-3 7-7 7z"/>
            <path d="M10.5 13.5l-2-2-1.5 1.5 3.5 3.5 5.5-5.5-1.5-1.5z"/>
          </svg>
        </div>
        <h2>General Dashboard</h2>
        <p>Access all your agency management tools from the sidebar.</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-value">24</div>
            <div className="stat-label">Active Agencies</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-value">156</div>
            <div className="stat-label">Export Receipts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">$2.4M</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-value">$181K</div>
            <div className="stat-label">Outstanding Debt</div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => onNavigate('export-receipt')}>
            <span className="action-icon">📄</span>
            <span>Create Export Receipt</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('payment-receipt')}>
            <span className="action-icon">💰</span>
            <span>Create Payment Receipt</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('debt-report')}>
            <span className="action-icon">💵</span>
            <span>View Debt Report</span>
          </button>
          <button className="action-btn" onClick={() => onNavigate('revenue-report')}>
            <span className="action-icon">📊</span>
            <span>View Revenue Report</span>
          </button>
        </div>
      </div>
    </MasterLayout>
  );
}

export default General;
