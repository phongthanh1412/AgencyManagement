import React, { useEffect, useState } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { updateAgency, deleteAgency } from '../services/agencyService';
import { getAgencyTypes } from '../services/agencyTypeService';

function EditAgency({ user, agency, onLogout, onNavigate }) {
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    type: "",
    phone: "",
    email: "",
    address: "",
    district: "",
    receivedDate: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getAgencyTypes().then(setTypes).catch(console.error);
  }, []);

  useEffect(() => {
    if (agency) {
      let foundTypeId = agency.typeId?._id || agency.typeId || "";

      // If foundTypeId is empty or just a name (length < 24 usually or check against types), try to find by name
      if ((!foundTypeId || !types.some(t => t._id === foundTypeId)) && agency.type) {
        const found = types.find(t => t.name === agency.type);
        if (found) foundTypeId = found._id;
      }

      setFormData({
        id: agency._id || agency.id,
        name: agency.name || "",
        type: foundTypeId,
        phone: agency.phone || "",
        email: agency.email || "",
        address: agency.address || "",
        district: agency.district || "",
        receivedDate: agency.receivedDate || "",
      });
    }
  }, [agency, types]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin || !formData.id) return;

    const updatedAgency = {
      id: formData.id,
      name: formData.name,
      typeId: formData.type, // ID
      district: Number(formData.district), // Ensure district is a number
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      debt: agency?.debt || 0,
      receivedDate: formData.receivedDate || new Date().toISOString().slice(0, 10),
    };

    updateAgency(formData.id, updatedAgency).then(() => {
      setShowSuccess(true);
    });
  };

  const handleDelete = () => {
    if (!isAdmin || !formData.id) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!isAdmin || !formData.id) return;
    deleteAgency(formData.id).then(() => {
      setShowDeleteConfirm(false);
      onNavigate("agency");
    });
  };

  if (!agency) {
    return (
      <MasterLayout currentPage="agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
        <div className="page-header">
          <h1>Edit Agency</h1>
          <p>No agency selected.</p>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout currentPage="agency" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <div>
          <h1>Edit Agency</h1>
          <p>Update agency information</p>
        </div>
        {isAdmin && (
          <div className="regulation-confirm-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate("agency")}
            >
              Back
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="receipt-card">
        <h3 className="receipt-section-title">Agency Information</h3>

        {!isAdmin ? (
          <div style={{ padding: "12px 0", color: "#ef4444", fontWeight: 600 }}>
            You do not have permission to edit agencies.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="receipt-info-grid">
              <div className="input-group">
                <label>Agency Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="input-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
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
                    name="receivedDate"
                    value={formData.receivedDate}
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
                Update Agency
              </button>
              <button type="button" className="btn-secondary" onClick={() => onNavigate('agency')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showSuccess && (
        <div className="regulation-modal-overlay" onClick={() => setShowSuccess(false)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon" style={{ background: "#ecfdf3", color: "#10b981" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>Agency Updated</h3>
            <p>The agency has been updated successfully. Go back to Agency Directory?</p>
            <div className="regulation-confirm-actions">
              <button className="btn-secondary" onClick={() => setShowSuccess(false)}>
                Stay
              </button>
              <button className="btn-primary" onClick={() => onNavigate('agency')}>
                Yes, Go to Agency Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="regulation-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3>Delete Agency</h3>
            <p>Are you sure you want to delete <strong>"{formData.name}"</strong>? This action cannot be undone.</p>
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

export default EditAgency;

