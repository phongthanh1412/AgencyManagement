import React, { useEffect, useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";
import {
  getExportReceiptsByAgency,
  getPaymentReceiptsByAgency,
  getDebtHistoryByAgency,
} from "../services/mockApi";

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

  const maxDebt = agency.type === "Type 2" ? 20000 : 50000;
  const debt = agency.debt || 0;
  const usage = Math.min(100, Math.round((debt / maxDebt) * 100));

  const [activeTab, setActiveTab] = useState("export");
  const [exportReceipts, setExportReceipts] = useState([]);
  const [paymentReceipts, setPaymentReceipts] = useState([]);
  const [debtHistory, setDebtHistory] = useState([]);

  useEffect(() => {
    if (agency?.id) {
      getExportReceiptsByAgency(agency.id).then(setExportReceipts);
      getPaymentReceiptsByAgency(agency.id).then(setPaymentReceipts);
      getDebtHistoryByAgency(agency.id).then(setDebtHistory);
    }
  }, [agency?.id]);

  return (
    <MasterLayout currentPage="agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <div>
          <h1>Agency Details</h1>
          <p>Complete information about the agency</p>
        </div>
        <div className="regulation-confirm-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onNavigate("agency")}
          >
            Back
          </button>
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
                onClick={() => onNavigate("edit-agency")}
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
                  {agency.receivedDate
                    ? new Date(agency.receivedDate).toLocaleDateString("en-GB")
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
                  <tr key={r.id}>
                    <td>{index + 1}</td>
                    <td>{r.code}</td>
                    <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                    <td>${r.total.toLocaleString()}.00</td>
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
                  <tr key={r.id}>
                    <td>{index + 1}</td>
                    <td>{r.code}</td>
                    <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                    <td>${r.amount.toLocaleString()}.00</td>
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
                  <tr key={r.id}>
                    <td>{index + 1}</td>
                    <td>{r.code}</td>
                    <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                    <td className={r.change > 0 ? "text-positive" : "text-negative"}>
                      {r.change > 0
                        ? `+$${r.change.toLocaleString()}.00`
                        : `-$${Math.abs(r.change).toLocaleString()}.00`}
                    </td>
                    <td>${r.debt.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MasterLayout>
  );
}

export default AgencyDetails;

