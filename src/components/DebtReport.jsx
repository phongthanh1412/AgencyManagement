import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";

const agencies = [
  { no: 1, name: "Blue Ocean Distributors", type: "Type 1", begin: 35000, change: 7000, end: 42000, status: "High Risk" },
  { no: 2, name: "Eagle Eye Wholesale", type: "Type 1", begin: 32000, change: 6000, end: 38000, status: "High Risk" },
  { no: 3, name: "Red Dragon Imports", type: "Type 1", begin: 28000, change: 3000, end: 31000, status: "Warning" },
  { no: 4, name: "Golden Star Trading Co.", type: "Type 1", begin: 20000, change: 5000, end: 25000, status: "Warning" },
  { no: 5, name: "Silver Moon Supplies", type: "Type 2", begin: 12000, change: 3000, end: 15000, status: "High Risk" },
  { no: 6, name: "Sunset Trading Hub", type: "Type 2", begin: 10000, change: 2000, end: 12000, status: "Warning" },
  { no: 7, name: "Green Valley Commerce", type: "Type 2", begin: 7000, change: 1500, end: 8500, status: "Normal" },
  { no: 8, name: "Phoenix Rising Co.", type: "Type 2", begin: 8000, change: 1500, end: 9500, status: "Normal" },
];

const statusClass = {
  "High Risk": "debt-status-high",
  Warning: "debt-status-warning",
  Normal: "debt-status-normal",
};

function DebtReport({ user, onLogout, onNavigate }) {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleGenerateReport = () => {
    alert(`Generating report for ${selectedPeriod} from ${fromDate || 'start'} to ${toDate || 'end'}`);
  };

  return (
    <MasterLayout currentPage="debt-report" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Debt Report</h1>
        <p>Monitor agency debt levels and changes</p>
      </div>
      
      <section className="debt-filters">
          <div className="debt-filters-header">
            <h3>Report Filters</h3>
            <button className="debt-generate" onClick={handleGenerateReport}>
              Generate Report
            </button>
          </div>
          <div className="debt-filter-row">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Custom Range</option>
            </select>
            <input 
              type="text" 
              placeholder="From dd/mm/yyyy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="To dd/mm/yyyy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="debt-summary-row">
            <div className="debt-summary debt-summary-total">
              <div className="summary-icon summary-icon-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Total Debt</div>
                <div className="debt-summary-value debt-total">$181,000.00</div>
              </div>
            </div>
            <div className="debt-summary debt-summary-risk">
              <div className="summary-icon summary-icon-red">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">High Risk Agencies</div>
                <div className="debt-summary-value debt-risk">3</div>
              </div>
            </div>
            <div className="debt-summary debt-summary-change">
              <div className="summary-icon summary-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <div className="summary-content">
                <div className="summary-label">Total Change</div>
                <div className="debt-summary-value debt-change">+$29,000.00</div>
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
                {agencies.map((a) => (
                  <tr key={a.no}>
                    <td>{a.no}</td>
                    <td className="agency-name">{a.name}</td>
                    <td>{a.type}</td>
                    <td>${a.begin.toLocaleString()}.00</td>
                    <td className="change-positive">+${a.change.toLocaleString()}.00</td>
                    <td className="ending-debt">${a.end.toLocaleString()}.00</td>
                    <td>
                      <span className={statusClass[a.status]}>{a.status}</span>
                    </td>
                  </tr>
                ))}
                <tr className="debt-table-total">
                  <td colSpan={3}><strong>Total</strong></td>
                  <td><strong>$152,000.00</strong></td>
                  <td className="change-positive"><strong>+$29,000.00</strong></td>
                  <td className="ending-debt"><strong>$181,000.00</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
    </MasterLayout>
  );
}

export default DebtReport;