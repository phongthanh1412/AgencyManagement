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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-label">Total Debt</div>
              <div className="debt-summary-value debt-total">${totalEnd.toLocaleString()}.00</div>
            </div>
          </div>
          <div className="debt-summary debt-summary-risk">
            <div className="summary-icon summary-icon-red">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="summary-content">
              <div className="summary-label">High Risk Agencies</div>
              <div className="debt-summary-value debt-risk">{reportData.highRiskCount}</div>
            </div>
          </div>
          <div className="debt-summary debt-summary-change">
            <div className="summary-icon summary-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
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
