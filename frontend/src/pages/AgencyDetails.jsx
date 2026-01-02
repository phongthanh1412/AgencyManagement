import React, { useEffect, useState } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import {
  getExportReceiptsByAgency,
  getPaymentReceiptsByAgency,
  getDebtHistoryByAgency,
  deleteAgency,
} from "../services/agencyService";

function AgencyDetails({ user, agency, onLogout, onNavigate, onEdit }) {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  if (!agency) {
    return (
      <MasterLayout currentPage="agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
        <div className="page-header">
          <h1>Agency Details</h1>
          <p>No agency selected.</p>
        </div>
      </MasterLayout>
    );
  }

  const maxDebt = agency.maxDebt || 0;
  const debt = agency.currentDebt || 0;
  const usage = maxDebt > 0 ? Math.min(100, Math.round((debt / maxDebt) * 100)) : 0;

  const [activeTab, setActiveTab] = useState("export");
  const [exportReceipts, setExportReceipts] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [debtHistory, setDebtHistory] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    if (agency?._id) {
      getExportReceiptsByAgency(agency._id).then(data => {
        if (isMounted) setExportReceipts(data);
      }).catch(err => {
        if (isMounted) console.error("Failed to load export receipts:", err);
      });
      
      getPaymentReceiptsByAgency(agency._id).then(data => {
        if (isMounted) setPaymentReceipts(data);
      }).catch(err => {
        if (isMounted) console.error("Failed to load payment receipts:", err);
      });
      
      getDebtHistoryByAgency(agency._id).then(data => {
        if (isMounted) setDebtHistory(data);
      }).catch(err => {
        if (isMounted) console.error("Failed to load debt history:", err);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [agency?._id]);

  const handleDelete = () => {
    if (!isAdmin || !agency?._id) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!isAdmin || !agency?._id) return;
    deleteAgency(agency._id)
      .then(() => {
        setShowDeleteConfirm(false);
        onNavigate("agency");
      })
      .catch((error) => {
        alert("Failed to delete agency: " + (error.message || "Unknown error"));
        setShowDeleteConfirm(false);
      });
  };

  return (
    <MasterLayout currentPage="agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <div>
          <h1>Agency Details</h1>
          <p>Complete information about the agency</p>
        </div>
        <div className="regulation-confirm-actions">
          {isAdmin && (
            <>
              <button
                type="button"
                className="btn-primary"
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="agency-details-layout">
        <div className="agency-details-main">
          <div className="receipt-card">
            <h3 className="receipt-section-title">Agency Information</h3>
            <div className="agency-details-grid">
              <div className="agency-details-block">
                <div className="agency-details-label">Agency Name</div>
                <div className="agency-details-value">{agency.name}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">Type</div>
                <div className="agency-details-tag">{agency.type}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">Email</div>
                <div className="agency-details-value">{agency.email || "—"}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">Phone</div>
                <div className="agency-details-value">{agency.phone}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">Address</div>
                <div className="agency-details-value">{agency.address || "—"}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">District</div>
                <div className="agency-details-tag">{agency.district}</div>
              </div>
              <div className="agency-details-block">
                <div className="agency-details-label">Received Date</div>
                <div className="agency-details-value">
                  {agency.receiptDate
                    ? (() => {
                        const date = new Date(agency.receiptDate);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date";
                      })()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="agency-details-side">
          <div className="agency-debt-card">
            <div className="agency-debt-header">Current Debt</div>
            <div className="agency-debt-amount">
              ${debt.toLocaleString()}.00
            </div>
            <div className="agency-debt-max">
              Max allowed: ${maxDebt.toLocaleString()}.00
            </div>
            <div className="agency-debt-bar-bg">
              <div
                className="agency-debt-bar-fill"
                style={{ width: `${usage}%` }}
              />
            </div>
            <div className="agency-debt-usage">
              Debt Usage: {usage}%
            </div>
          </div>
        </div>
      </div>

      <div className="agency-history-section">
        <div className="agency-history-tabs">
          <button
            type="button"
            className={`agency-history-tab ${activeTab === "export" ? "active" : ""}`}
            onClick={() => setActiveTab("export")}
          >
            Export Receipts
          </button>
          <button
            type="button"
            className={`agency-history-tab ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            Payment Receipts
          </button>
          <button
            type="button"
            className={`agency-history-tab ${activeTab === "debt" ? "active" : ""}`}
            onClick={() => setActiveTab("debt")}
          >
            Debt History
          </button>
        </div>

        <div className="table-wrapper">
          {activeTab === "export" && (
            <table className="debt-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Receipt Code</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {exportReceipts.map((r, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{r.receiptCode}</td>
                    <td>{r.date ? (() => {
                        const date = new Date(r.date);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date";
                      })() : "—"}</td>
                    <td>${r.totalAmount.toLocaleString()}.00</td>
                    <td>{r.items} items</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "payment" && (
            <table className="debt-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Receipt Code</th>
                  <th>Date</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {paymentReceipts.map((r, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{r.receiptCode}</td>
                    <td>{r.date ? (() => {
                        const date = new Date(r.date);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date";
                      })() : "—"}</td>
                    <td>${r.amountPaid.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "debt" && (
            <table className="debt-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Receipt Code</th>
                  <th>Date</th>
                  <th>Changes</th>
                  <th>Debt</th>
                </tr>
              </thead>
              <tbody>
                {debtHistory.map((r, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{r.receiptCode}</td>
                    <td>{r.date ? (() => {
                        const date = new Date(r.date);
                        return !isNaN(date.getTime()) ? date.toLocaleDateString("en-GB") : "Invalid Date";
                      })() : "—"}</td>
                    <td className={r.changes > 0 ? "text-positive" : "text-negative"}>
                      {r.changes > 0
                        ? `+$${r.changes.toLocaleString()}.00`
                        : `-$${Math.abs(r.changes).toLocaleString()}.00`}
                    </td>
                    <td>${r.debt.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="regulation-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3>Delete Agency</h3>
            <p>Are you sure you want to delete <strong>"{agency.name}"</strong>? This action cannot be undone.</p>
            <div className="regulation-confirm-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                No
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}

export default AgencyDetails;

