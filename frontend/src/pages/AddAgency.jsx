import React, { useState, useEffect } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { createAgency } from '../services/agencyService';
import { getAgencyTypes } from '../services/agencyTypeService';
import { getSystemRegulation } from '../services/systemRegulationService';

function AddAgency({ user, onLogout, onNavigate }) {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [formData, setFormData] = useState({
    agencyName: "",
    type: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    receiptDate: "",
  });
  const [types, setTypes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdAgency, setCreatedAgency] = useState(null);
  const [error, setError] = useState(null);
  const [regulation, setRegulation] = useState(null);

  useEffect(() => {
    Promise.all([
      getAgencyTypes(),
      getSystemRegulation()
    ]).then(([typesList, regulationData]) => {
      setTypes(typesList || []);
      setRegulation(regulationData);
    }).catch(err => {
      setError("Failed to load agency types or system regulation: " + (err.message || "Unknown error"));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      return;
    }
    const newAgency = {
      name: formData.agencyName,
      typeId: formData.type, 
      district: Number(formData.district),
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      receiptDate: formData.receiptDate || new Date().toISOString().slice(0, 10),
    };

    createAgency(newAgency).then((created) => {
      setCreatedAgency(created);
      setShowSuccess(true);
      setError(null);
    }).catch(err => {
      setError(err.message || "Failed to create agency");
    });
  };

  const handleCancel = () => {
    onNavigate('general');
  };

  return (
    <MasterLayout currentPage="add-agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Add New Agency</h1>
        <p>Create a new agency in the system</p>
      </div>

      <div className="restrictions-box">
        <div className="restrictions-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <div className="restrictions-content">
          <div className="restrictions-title">Please note the following restrictions:</div>
          <ul className="restrictions-list">
            {regulation && (
              <>
                <li>Maximum {regulation.maxAgencyPerDistrict || 10} agencies per district</li>
                <li>Cannot add agencies to districts greater than {regulation.maxDistrict || 20}</li>
              </>
            )}
            {types.length > 0 ? (
              types.map(type => (
                <li key={type._id}>
                  {type.name} agencies have a max debt limit of ${(type.maxDebt || 0).toLocaleString()}
                </li>
              ))
            ) : (
              <li>Loading agency types...</li>
            )}
          </ul>
        </div>
      </div>

      <div className="receipt-card">
        <h3 className="receipt-section-title">Agency Information</h3>

        {!isAdmin ? (
          <div style={{ padding: "12px 0", color: "#ef4444", fontWeight: 600 }}>
            You do not have permission to create agencies.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="receipt-info-grid">
              <div className="input-group">
                <label>Agency Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleChange}
                  placeholder="Enter agency name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Type <span className="required">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  {types.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Phone <span className="required">*</span></label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="agency@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label>Address <span className="required">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="input-group">
                <label>District <span className="required">*</span></label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select district</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      District {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Received Date <span className="required">*</span></label>
                <div className="date-input-wrapper" onClick={(e) => {
                  const input = e.currentTarget.querySelector('input[type="date"]');
                  if (input && input.showPicker) {
                    input.showPicker();
                  } else {
                    input?.focus();
                  }
                }}>
                  <input
                    type="date"
                    className="date-input"
                    name="receiptDate"
                    value={formData.receiptDate}
                    onChange={handleChange}
                    required
                  />
                  <span className="date-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="receipt-actions">
              <button type="submit" className="btn-primary">
                Create Agency
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showSuccess && createdAgency && (
        <div className="regulation-modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon" style={{ background: "#ecfdf3", color: "#10b981" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>Agency Created</h3>
            <p>
              Agency <strong>"{createdAgency.name}"</strong> has been created successfully.
              Do you want to view it in Agency Directory?
            </p>
            <div className="regulation-confirm-actions">
              <button className="btn-secondary" onClick={() => setShowSuccess(false)}>
                No
              </button>
              <button className="btn-primary" onClick={() => onNavigate('agency')}>
                Yes, Go to Agency Directory
              </button>
            </div>
          </div>
        </div>
      )}

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
    </MasterLayout>
  );
}

export default AddAgency;

