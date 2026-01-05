import React, { useState, useEffect } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { getAgencies } from "../services/agencyService";
import { getExportReceipts } from "../services/exportReceiptService";
import { getRevenueReport } from "../services/reportService";

function General({ user, onLogout, onNavigate }) {
  const [stats, setStats] = useState({
    activeAgencies: 0,
    exportReceipts: 0,
    totalRevenue: 0,
    outstandingDebt: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        
        // Fetch agencies
        const agenciesData = await getAgencies();
        console.log('Agencies data:', agenciesData);
        const activeAgencies = Array.isArray(agenciesData) ? agenciesData.length : 0;
        
        // Calculate total outstanding debt (field is currentDebt, not debt)
        const totalDebt = Array.isArray(agenciesData) 
          ? agenciesData.reduce((sum, agency) => sum + (agency.currentDebt || 0), 0)
          : 0;
        
        // Fetch export receipts
        const receiptsData = await getExportReceipts();
        console.log('Export receipts data:', receiptsData);
        const exportReceipts = Array.isArray(receiptsData) ? receiptsData.length : 0;
        
        // Calculate total revenue directly from export receipts
        const totalRevenue = Array.isArray(receiptsData)
          ? receiptsData.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0)
          : 0;
        
        console.log('Final stats:', { activeAgencies, exportReceipts, totalRevenue, outstandingDebt: totalDebt });
        
        setStats({
          activeAgencies,
          exportReceipts,
          totalRevenue,
          outstandingDebt: totalDebt,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error details:', error.message, error.stack);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

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
            <div className="stat-value">{stats.loading ? '...' : stats.activeAgencies}</div>
            <div className="stat-label">Active Agencies</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#0ea5e9' }}>
              <div className="stat-icon">
              <img src="/receipt.png" alt="Organization" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">{stats.loading ? '...' : stats.exportReceipts}</div>
            <div className="stat-label">Export Receipts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#10b981' }}>
              <div className="stat-icon">
              <img src="/revenue.png" alt="Revenue" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">{stats.loading ? '...' : formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#ef4444' }}>
              <div className="stat-icon">
              <img src="/debt.png" alt="Debt" width="32" height="32" style={{ display: 'block', margin: '0 auto' }} />
            </div>
            </div>
            <div className="stat-value">{stats.loading ? '...' : formatCurrency(stats.outstandingDebt)}</div>
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
