import React, { useEffect, useMemo, useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";
import { getAgencies, getExportReceipts } from "../services/mockApi";

export default function RevenueReport({ user, onLogout, onNavigate }) {
  const [period, setPeriod] = useState("This Month");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    getAgencies().then(setAgencies);
    getExportReceipts().then(setReceipts);
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchFrom = !fromDate || new Date(r.date) >= new Date(fromDate);
      const matchTo = !toDate || new Date(r.date) <= new Date(toDate);
      return matchFrom && matchTo;
    });
  }, [receipts, fromDate, toDate]);

  const summary = useMemo(() => {
    const totalRevenue = filteredReceipts.reduce((s, r) => s + (r.total || 0), 0);
    const totalReceipts = filteredReceipts.length;
    const avgPerReceipt = totalReceipts ? Math.round(totalRevenue / totalReceipts) : 0;
    return { totalRevenue, totalReceipts, avgPerReceipt };
  }, [filteredReceipts]);

  const aggByAgency = useMemo(() => {
    const map = new Map();
    filteredReceipts.forEach((r) => {
      map.set(r.agencyId, (map.get(r.agencyId) || 0) + (r.total || 0));
    });
    return Array.from(map.entries()).map(([agencyId, total]) => {
      const agency = agencies.find((a) => a.id === agencyId);
      return { agency: agency?.name || `Agency ${agencyId}`, total };
    });
  }, [filteredReceipts, agencies]);

  const chartData = useMemo(() => {
    return aggByAgency;
  }, [aggByAgency]);

  const breakdown = useMemo(() => {
    const mapCount = new Map();
    const mapTotal = new Map();
    filteredReceipts.forEach((r) => {
      mapCount.set(r.agencyId, (mapCount.get(r.agencyId) || 0) + 1);
      mapTotal.set(r.agencyId, (mapTotal.get(r.agencyId) || 0) + (r.total || 0));
    });
    const rows = Array.from(mapTotal.entries()).map(([agencyId, total]) => {
      const agency = agencies.find((a) => a.id === agencyId);
      const slips = mapCount.get(agencyId) || 0;
      const pct = summary.totalRevenue ? (total / summary.totalRevenue) * 100 : 0;
      return {
        agency: agency?.name || `Agency ${agencyId}`,
        slips,
        total,
        pct: Math.round(pct * 10) / 10,
      };
    });
    return rows
      .sort((a, b) => b.total - a.total)
      .map((row, idx) => ({ ...row, no: idx + 1 }));
  }, [filteredReceipts, agencies, summary.totalRevenue]);

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  return (
    <MasterLayout currentPage="revenue-report" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Revenue Report</h1>
        <p>Track and analyze revenue performance</p>
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
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="date-input-group">
            <span className="date-input-caption">From</span>
            <div
              className="date-input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type="date"]');
                if (input && input.showPicker) {
                  input.showPicker();
                } else if (input) {
                  input.focus();
                }
              }}
            >
              <input
                type="date"
                className="date-input"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <span className="date-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z"/>
                </svg>
              </span>
            </div>
          </div>
          <div className="date-input-group">
            <span className="date-input-caption">To</span>
            <div
              className="date-input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type="date"]');
                if (input && input.showPicker) {
                  input.showPicker();
                } else if (input) {
                  input.focus();
                }
              }}
            >
              <input
                type="date"
                className="date-input"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
              <span className="date-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="debt-summary-row revenue-summary-row">
        <div className="debt-summary">
          <div className="summary-icon summary-icon-green">$</div>
          <div className="summary-content">
            <div className="summary-label">Total Revenue</div>
            <div className="debt-summary-value">${summary.totalRevenue.toLocaleString()}.00</div>
          </div>
        </div>
        <div className="debt-summary">
          <div className="summary-icon summary-icon-blue">📄</div>
          <div className="summary-content">
            <div className="summary-label">Export Receipts</div>
            <div className="debt-summary-value">{summary.totalReceipts}</div>
          </div>
        </div>
        <div className="debt-summary">
          <div className="summary-icon summary-icon-purple">↗</div>
          <div className="summary-content">
            <div className="summary-label">Avg per Receipt</div>
            <div className="debt-summary-value">${summary.avgPerReceipt.toLocaleString()}.00</div>
          </div>
        </div>
      </section>

      <section className="chart-card">
        <h3>Revenue by Agency</h3>
        {(() => {
          const maxValue = Math.max(...chartData.map((c) => c.total || 0), 1);
          const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(maxValue * p));
          return (
            <div className="bar-chart-wrapper">
              <div className="bar-chart-y-axis">
                {[...yTicks].reverse().map((val, idx) => (
                  <div key={idx} className="y-tick">${val.toLocaleString()}</div>
                ))}
              </div>
              <div className="bar-chart">
                {chartData.map((item) => (
                  <div key={item.agency} className="bar">
                    <div
                      className="bar-fill"
                      style={{ height: `${(item.total / maxValue) * 100}%` }}
                      title={`${item.agency}: $${(item.total || 0).toLocaleString()}`}
                    />
                    <div className="bar-label">{item.agency}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      <section className="table-card">
        <h3>Detailed Revenue Breakdown</h3>
        <div className="table-wrapper">
          <table className="debt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Agency</th>
                <th>Number of Export Slips</th>
                <th>Total Value</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.no}>
                  <td>{row.no}</td>
                  <td>{row.agency}</td>
                  <td>{row.slips}</td>
                  <td>${row.total.toLocaleString()}.00</td>
                  <td>{row.pct}%</td>
                </tr>
              ))}
              <tr className="debt-table-total">
                <td colSpan={2}><strong>Total</strong></td>
                <td><strong>{summary.totalReceipts}</strong></td>
                <td><strong>${summary.totalRevenue.toLocaleString()}.00</strong></td>
                <td><strong>100%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {showReportModal && (
        <div className="regulation-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="debt-report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="debt-report-modal-header">
              <div>
                <h3>Revenue Report - {period}</h3>
                <p>Detailed revenue breakdown by agency</p>
              </div>
              <button className="regulation-modal-close" onClick={() => setShowReportModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="debt-report-modal-body">
              <div className="debt-report-period">
                <span>From: <strong>{fromDate || "start"}</strong></span>
                <span>To: <strong>{toDate || "end"}</strong></span>
              </div>

              <div className="table-wrapper">
                <table className="debt-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Agency</th>
                      <th>Number of Export Slips</th>
                      <th>Total Value</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((row) => (
                      <tr key={row.no}>
                        <td>{row.no}</td>
                        <td>{row.agency}</td>
                        <td>{row.slips}</td>
                        <td>${row.total.toLocaleString()}.00</td>
                        <td>{row.pct}%</td>
                      </tr>
                    ))}
                    <tr className="debt-table-total">
                      <td colSpan={2}><strong>Total</strong></td>
                      <td><strong>{summary.totalReceipts}</strong></td>
                      <td><strong>${summary.totalRevenue.toLocaleString()}.00</strong></td>
                      <td><strong>100%</strong></td>
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
                onClick={() => alert("Mock export PDF - frontend only")}
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}

