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
            <img src="/company.png" alt="Company Logo" width="64" height="64" style={{ display: 'block', margin: '0 auto' }} />
          </div>
        <h2>Dashboard</h2>
        <p>Access all your agency management tools from the sidebar</p>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <img src="/company.png" alt="Organization" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">Active Agencies</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#0ea5e9' }}>
              <div className="stat-icon">
              <img src="/receipt.png" alt="Organization" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">156</div>
            <div className="stat-label">Export Receipts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#10b981' }}>
              <div className="stat-icon">
              <img src="/revenue.png" alt="Revenue" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">$2.4M</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#ef4444' }}>
              <div className="stat-icon">
              <img src="/debt.png" alt="Debt" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">$181K</div>
            <div className="stat-label">Outstanding Debt</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn action-btn-export" onClick={() => onNavigate('export-receipt')}>
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, margin: '0 auto' }}>
              <img src="/receipt_quick.png" alt="Export Receipt" width="32" height="32" style={{ display: 'block' }} />
            </span>
            <span>Export Receipt</span>
          </button>
          <button className="action-btn action-btn-payment" onClick={() => onNavigate('payment-receipt')}>
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, margin: '0 auto' }}>
              <img src="/credit-card.png" alt="Payment" width="32" height="32" style={{ display: 'block' }} />
            </span>
            <span>Payment Receipt</span>
          </button>
          <button className="action-btn action-btn-debt" onClick={() => onNavigate('debt-report')}>
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, margin: '0 auto' }}>
              <img src="/debt_quick.png" alt="Debt" width="32" height="32" style={{ display: 'block' }} />
            </span>
            <span>Debt Report</span>
          </button>
          <button className="action-btn action-btn-revenue" onClick={() => onNavigate('revenue-report')}>
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, margin: '0 auto' }}>
              <img src="/revenue.png" alt="Revenue" width="32" height="32" style={{ display: 'block' }} />
            </span>
            <span>Revenue Report</span>
          </button>
        </div>
      </div>
    </MasterLayout>
  );
}

export default General;
