import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";

const agencies = [
  { 
    id: 1, 
    name: "Golden Star Trading Co.", 
    address: "123 Main Street, District 1",
    phone: "(555) 123-4567",
    email: "contact@goldenstar.com",
    currentDebt: 25000
  },
  { 
    id: 2, 
    name: "Blue Ocean Distributors",
    address: "456 Ocean Ave, District 2", 
    phone: "(555) 234-5678",
    email: "info@blueocean.com",
    currentDebt: 42000
  },
  { 
    id: 3, 
    name: "Red Dragon Imports",
    address: "789 Dragon St, District 3",
    phone: "(555) 345-6789",
    email: "contact@reddragon.com", 
    currentDebt: 31000
  }
];

function PaymentReceipt({ user, onLogout, onNavigate, currentPage = 'payment-receipt' }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [receiptDate, setReceiptDate] = useState("19/07/2025");
  const [amountCollected, setAmountCollected] = useState("");

  const handleAgencySelect = (agency) => {
    setSelectedAgency(agency);
    setSearchQuery(agency.name);
  };

  const handleCreateReceipt = () => {
    if (!amountCollected || parseFloat(amountCollected) <= 0) {
      alert("Please enter a valid amount collected");
      return;
    }
    
    const amount = parseFloat(amountCollected);
    const afterPayment = selectedAgency.currentDebt - amount;
    
    alert(
      `Payment Receipt Created!\n` +
      `Agency: ${selectedAgency.name}\n` +
      `Amount Collected: $${amount.toFixed(2)}\n` +
      `Previous Debt: $${selectedAgency.currentDebt.toLocaleString()}.00\n` +
      `After Payment: $${afterPayment.toLocaleString()}.00`
    );
    
    // Reset form
    setSelectedAgency(null);
    setSearchQuery("");
    setAmountCollected("");
  };

  const handleCancel = () => {
    onNavigate('general');
  };

  const afterPayment = selectedAgency && amountCollected 
    ? selectedAgency.currentDebt - parseFloat(amountCollected || 0)
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
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                {searchQuery && (
                  <div className="agency-dropdown">
                    {agencies
                      .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(agency => (
                        <div 
                          key={agency.id}
                          className="agency-dropdown-item"
                          onClick={() => handleAgencySelect(agency)}
                        >
                          <div className="agency-dropdown-name">{agency.name}</div>
                          <div className="agency-dropdown-debt">
                            Current Debt: ${agency.currentDebt.toLocaleString()}.00
                          </div>
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
            <input 
              type="text" 
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>

        {selectedAgency && (
          <>
            <div className="agency-info-row payment-info-row">
              <div className="agency-info-item">
                <div className="info-label">Address</div>
                <div className="info-value">{selectedAgency.address}</div>
              </div>
              <div className="agency-info-item">
                <div className="info-label">Phone</div>
                <div className="info-value">{selectedAgency.phone}</div>
              </div>
              <div className="agency-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{selectedAgency.email}</div>
              </div>
            </div>

            <div className="payment-debt-summary">
              <div className="debt-summary-item">
                <div className="debt-summary-label">Current Outstanding Debt</div>
                <div className="debt-summary-amount current-debt">
                  ${selectedAgency.currentDebt.toLocaleString()}.00
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
            disabled={!selectedAgency || !amountCollected}
          >
            Create Receipt
          </button>
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </MasterLayout>
  );
}

export default PaymentReceipt;