import React, { useEffect, useState } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { getAgencies } from '../services/agencyService';
import { createPaymentReceipt } from '../services/paymentReceiptService';

function PaymentReceipt({ user, onLogout, onNavigate, currentPage = 'payment-receipt' }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [receiptDate, setReceiptDate] = useState("2025-07-19");
  const [amountCollected, setAmountCollected] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getAgencies()
      .then(setAgencies)
      .catch(err => {
        setError("Failed to load agencies: " + (err.message || "Unknown error"));
      });
  }, []);

  const handleAgencySelect = (agency) => {
    setSelectedAgency(agency);
    setSearchQuery(agency.name);
  };

  const handleCreateReceipt = async () => {
    if (!selectedAgency) {
      setError("Please select an agency");
      return;
    }

    if (!amountCollected || parseFloat(amountCollected) <= 0) {
      setError("Please enter a valid amount collected");
      return;
    }

    const amount = parseFloat(amountCollected);
    if (amount > (selectedAgency.currentDebt || 0)) {
      setError("Amount collected cannot exceed the agency's current debt.");
      return;
    }

    try {
      await createPaymentReceipt({
        agencyId: selectedAgency.id || selectedAgency._id,
        date: receiptDate,
        amountPaid: amount
      });

      setSuccessMessage(`Payment Receipt Created for ${selectedAgency.name}!`);
      setShowSuccess(true);
      setError(null);

      // Refresh agencies
      const list = await getAgencies();
      setAgencies(list);
      // Clear form
      setSelectedAgency(null);
      setSearchQuery("");
      setAmountCollected("");

    } catch (error) {
      setError(error.message || "Failed to create payment receipt");
    }
  };

  const handleCancel = () => {
    onNavigate('general');
  };

  const afterPayment = selectedAgency && amountCollected
    ? (selectedAgency.currentDebt || 0) - parseFloat(amountCollected || 0)
    : 0;

  return (
    <MasterLayout currentPage={currentPage} user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Create Payment Receipt</h1>
        <p>Record a payment from an agency</p>
      </div>

      <div className="receipt-card">
        <h3 className="receipt-section-title">Payment Information</h3>

        <div className="receipt-info-grid">
          <div className="input-group">
            <label>Agency <span className="required">*</span></label>
            {!selectedAgency ? (
              <div className="search-select-wrapper">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search and select agency"
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                {searchQuery && (
                  <div className="agency-dropdown">
                    {Array.isArray(agencies) && agencies
                      .filter(a => a && typeof a.name === 'string' && a.name.toLowerCase().includes((searchQuery || "").toLowerCase()))
                      .map(agency => (
                        <div
                          key={agency.id}
                          className="agency-dropdown-item"
                          onClick={() => handleAgencySelect(agency)}
                        >
                          <div className="agency-dropdown-name">{agency.name}</div>

                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <select
                value={selectedAgency.name}
                onChange={(e) => {
                  const agency = agencies.find(a => a.name === e.target.value);
                  setSelectedAgency(agency);
                }}
              >
                {agencies.map(agency => (
                  <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="input-group">
            <label>Receipt Date <span className="required">*</span></label>
            <div
              className="date-input-wrapper"
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input[type=\"date\"]');
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
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
              />
              <span className="date-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {selectedAgency && (
          <>
            <div className="agency-info-row payment-info-row">
              <div className="agency-info-item">
                <div className="info-label">Address</div>
                <div className="info-value">{selectedAgency?.address || "—"}</div>
              </div>
              <div className="agency-info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">{selectedAgency?.phone || "—"}</div>
              </div>
              <div className="agency-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{selectedAgency?.email || "—"}</div>
              </div>
            </div>

            <div className="payment-debt-summary">
              <div className="debt-summary-item">
                <div className="debt-summary-label">Current Outstanding Debt</div>
                <div className="debt-summary-amount current-debt">
                  ${(selectedAgency.currentDebt || 0).toLocaleString()}.00
                </div>
              </div>
              <div className="debt-summary-item">
                <div className="debt-summary-label">After Payment</div>
                <div className="debt-summary-amount after-payment">
                  ${afterPayment.toLocaleString()}.00
                </div>
              </div>
            </div>
          </>
        )}

        <div className="input-group">
          <label>Amount Collected <span className="required">*</span></label>
          <input
            type="number"
            value={amountCollected}
            onChange={(e) => setAmountCollected(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className="receipt-actions">
          <button
            className="btn-primary"
            onClick={handleCreateReceipt}
          >
            Create Receipt
          </button>
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="regulation-modal-overlay" onClick={() => setError(null)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h3>Error</h3>
            <p style={{ color: "#1e293b", marginBottom: "20px" }}>
              {error}
            </p>
            <div className="regulation-confirm-actions">
              <button className="btn-primary" onClick={() => setError(null)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="regulation-modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon" style={{ background: "#ecfdf3", color: "#10b981" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>Success</h3>
            <p style={{ color: "#1e293b", marginBottom: "20px" }}>
              {successMessage}
            </p>
            <div className="regulation-confirm-actions">
              <button className="btn-primary" onClick={() => setShowSuccess(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}

export default PaymentReceipt;
