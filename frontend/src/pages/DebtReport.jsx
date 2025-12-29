import React, { useState, useEffect } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { getDebtReport } from "../services/reportService";

const statusClass = {
  "High Risk": "debt-status-high",
  "high risk": "debt-status-high",
  Warning: "debt-status-warning",
  warning: "debt-status-warning",
  Normal: "debt-status-normal",
  normal: "debt-status-normal",
};

function DebtReport({ user, onLogout, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    agencies: [],
    totalDebt: 0,
    highRiskCount: 0,
    totalChanges: 0,
    totalBeginningDebt: 0,
    totalEndingDebt: 0
  });

  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    fetchReport();
  }, [selectedPeriod]);

  const fetchReport = async () => {
    try {
      const data = await getDebtReport(selectedPeriod);
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch debt report:", error);
    }
  };

  const handleGenerateReport = () => {
    fetchReport();
    setShowReportModal(true);
  };

  const agencies = reportData.agencies || [];
  const totalBegin = reportData.totalBeginningDebt || 0;
  const totalChange = reportData.totalChanges || 0;
  const totalEnd = reportData.totalEndingDebt || 0;

  return (
    <MasterLayout currentPage="debt-report" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Debt Report</h1>
        <p>Monitor agency debt levels and changes</p>
      </div>

      <section className="debt-filters">
        <div className="debt-filters-header">
          <h3>Report Filters</h3>
          {!isAdmin && (
            <button className="debt-generate" onClick={handleGenerateReport}>
              Generate Report
            </button>
          )}
        </div>
        <div className="debt-filter-row">
          <div className="date-input-group">
            <span className="date-input-caption">Period</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          {/* Date inputs can be wired up for custom range in future */}
        </div>
        <div className="debt-summary-row">
          <div className="debt-summary debt-summary-total">
            <div className="summary-icon summary-icon-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Debt</div>
              <div className="debt-summary-value debt-total">${totalEnd.toLocaleString()}.00</div>
            </div>
          </div>
          <div className="debt-summary debt-summary-risk">
            <div className="summary-icon summary-icon-red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-label">High Risk Agencies</div>
              <div className="debt-summary-value debt-risk">{reportData.highRiskCount}</div>
            </div>
          </div>
          <div className="debt-summary debt-summary-change">
            <div className="summary-icon summary-icon-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Change</div>
              <div className="debt-summary-value debt-change">
                {totalChange >= 0 ? "+" : "-"}${Math.abs(totalChange).toLocaleString()}.00
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="debt-table-section">
        <h2>Debt Status by Agency</h2>
        <div className="table-wrapper">
          <table className="debt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Agency</th>
                <th>Type</th>
                <th>Beginning Debt</th>
                <th>Changes</th>
                <th>Ending Debt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {agencies.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No data available</td>
                </tr>
              ) : (
                agencies.map((a, index) => (
                  <tr key={a.agencyId || index}>
                    <td>{index + 1}</td>
                    <td className="agency-name">{a.agencyName}</td>
                    <td>{a.type}</td>
                    <td>${(a.beginningDebt || 0).toLocaleString()}.00</td>
                    <td className={(a.changes || 0) >= 0 ? "text-positive" : "text-negative"}>
                      {(a.changes || 0) >= 0
                        ? `+$${(a.changes || 0).toLocaleString()}.00`
                        : `-$${Math.abs(a.changes || 0).toLocaleString()}.00`}
                    </td>
                    <td className="ending-debt">${(a.endingDebt || 0).toLocaleString()}.00</td>
                    <td>
                      <span className={statusClass[a.status] || statusClass['Normal']}>{a.status ? a.status.toUpperCase() : 'NORMAL'}</span>
                    </td>
                  </tr>
                ))
              )}
              {agencies.length > 0 && (
                <tr className="debt-table-total">
                  <td colSpan={3}><strong>Total</strong></td>
                  <td><strong>${totalBegin.toLocaleString()}.00</strong></td>
                  <td className={totalChange >= 0 ? "text-positive" : "text-negative"}><strong>
                    {totalChange >= 0 ? "+" : "-"}${Math.abs(totalChange).toLocaleString()}.00
                  </strong></td>
                  <td className="ending-debt"><strong>${totalEnd.toLocaleString()}.00</strong></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showReportModal && (
        <div className="regulation-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="debt-report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="debt-report-modal-header">
              <div>
                <h3>Debt Report - {selectedPeriod}</h3>
                <p>Detailed debt breakdown by agency</p>
              </div>
              <button className="regulation-modal-close" onClick={() => setShowReportModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="debt-report-modal-body">
              <div className="debt-report-period">
                <span>Period: <strong>{selectedPeriod}</strong></span>
              </div>

              <div className="table-wrapper">
                <table className="debt-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Agency</th>
                      <th>Type</th>
                      <th>Beginning Debt</th>
                      <th>Changes</th>
                      <th>Ending Debt</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((a, index) => (
                      <tr key={a.agencyId || index}>
                        <td>{index + 1}</td>
                        <td className="agency-name">{a.agencyName}</td>
                        <td>{a.type}</td>
                        <td>${(a.beginningDebt || 0).toLocaleString()}.00</td>
                        <td className={(a.changes || 0) >= 0 ? "text-positive" : "text-negative"}>
                          {(a.changes || 0) >= 0
                            ? `+$${(a.changes || 0).toLocaleString()}.00`
                            : `-$${Math.abs(a.changes || 0).toLocaleString()}.00`}
                        </td>
                        <td className="ending-debt">${(a.endingDebt || 0).toLocaleString()}.00</td>
                        <td>
                          <span className={statusClass[a.status] || statusClass['Normal']}>{a.status ? a.status.toUpperCase() : 'NORMAL'}</span>
                        </td>
                      </tr>
                    ))}
                    <tr className="debt-table-total">
                      <td colSpan={3}><strong>Total</strong></td>
                      <td><strong>${totalBegin.toLocaleString()}.00</strong></td>
                      <td className={totalChange >= 0 ? "text-positive" : "text-negative"}>
                        <strong>
                          {totalChange >= 0 ? "+" : "-"}
                          ${Math.abs(totalChange).toLocaleString()}.00
                        </strong>
                      </td>
                      <td className="ending-debt"><strong>${totalEnd.toLocaleString()}.00</strong></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="debt-report-modal-footer">
              <button className="btn-secondary" onClick={() => setShowReportModal(false)}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => alert("Printing not implemented yet")}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}

export default DebtReport;
