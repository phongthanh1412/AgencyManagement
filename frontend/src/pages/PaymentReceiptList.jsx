import React, { useMemo, useState } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";

import { getPaymentReceipts } from '../services/paymentReceiptService';

function PaymentReceiptList({ user, onLogout, onNavigate }) {
  const [searchCode, setSearchCode] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("All Agencies");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [receipts, setReceipts] = useState([]);

  React.useEffect(() => {
    getPaymentReceipts().then(setReceipts).catch(console.error);
  }, []);

  const agencies = useMemo(
    () => ["All Agencies", ...Array.from(new Set(receipts.map((r) => r.agencyName)))],
    [receipts]
  );

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchCode =
        !searchCode || r.receiptCode.toLowerCase().includes(searchCode.toLowerCase());
      const matchAgency =
        agencyFilter === "All Agencies" || r.agencyName === agencyFilter;
      const matchFrom = !fromDate || new Date(r.date) >= new Date(fromDate);
      const matchTo = !toDate || new Date(r.date) <= new Date(toDate);
      return matchCode && matchAgency && matchFrom && matchTo;
    });
  }, [receipts, searchCode, agencyFilter, fromDate, toDate]);

  return (
    <MasterLayout
      currentPage="payment-receipt"
      user={user}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <div className="page-header">
        <h1>Payment Receipt</h1>
        <p>Search and view payment receipts</p>
      </div>

      <section className="debt-filters">
        <div className="debt-filters-header">
          <h3>Filters</h3>
        </div>
        <div className="debt-filter-row">
          <div className="date-input-group" style={{ flex: 1.3 }}>
            <span className="date-input-caption">Receipt code</span>
            <input
              type="text"
              placeholder="Search by receipt code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="date-input-group" style={{ flex: 0.9 }}>
            <span className="date-input-caption">Agency</span>
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
            >
              {agencies.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="date-input-group" style={{ flex: 1.5 }}>
            <div className="date-range-inputs">
              <div className="date-range-item">
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
                </div>
              </div>
              <div className="date-range-item">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="debt-table-section agency-table-section">
        <div className="agency-table-header">
          <h2>Payment Receipts ({filteredReceipts.length})</h2>
        </div>
        <div className="table-wrapper">
          <table className="debt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Receipt Code</th>
                <th>Agency</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((r, index) => (
                <tr
                  key={r._id || index}
                  className="clickable-row"
                  onClick={() => setSelectedReceipt(r)}
                >
                  <td>{index + 1}</td>
                  <td>{r.receiptCode}</td>
                  <td>{r.agencyName}</td>
                  <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                  <td>${r.amountPaid.toLocaleString()}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReceipt && (
        <div
          className="regulation-modal-overlay"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="receipt-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="receipt-detail-header">
              <h3>Payment Receipt Details</h3>
              <button
                className="regulation-modal-close"
                onClick={() => setSelectedReceipt(null)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="receipt-detail-body">
              <div className="receipt-detail-info-grid">
                <div className="receipt-detail-card">
                  <div className="info-label">Receipt ID</div>
                  <div className="info-value">{selectedReceipt.receiptCode}</div>
                  <div className="info-label" style={{ marginTop: 16 }}>Agency Name</div>
                  <div className="info-value">{selectedReceipt.agencyName}</div>
                </div>
                <div className="receipt-detail-card">
                  <div className="info-label">Date Created</div>
                  <div className="info-value">
                    {new Date(selectedReceipt.date).toLocaleDateString("en-GB")}
                  </div>
                  <div className="info-label" style={{ marginTop: 16 }}>Amount Paid</div>
                  <div className="info-value total-value">
                    ${selectedReceipt.amountPaid.toLocaleString()}.00
                  </div>
                </div>
              </div>

              <h4 className="receipt-detail-items-title">Payment Information</h4>
              <div className="receipt-detail-card">
                <div className="info-label">Payment Method</div>
                <div className="info-value">{selectedReceipt.method || "—"}</div>
                <div className="info-label" style={{ marginTop: 12 }}>Note</div>
                <div className="info-value">
                  {selectedReceipt.note || "—"}
                </div>
              </div>
            </div>

            <div className="receipt-detail-footer">
              <button
                className="btn-secondary"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}

export default PaymentReceiptList;


