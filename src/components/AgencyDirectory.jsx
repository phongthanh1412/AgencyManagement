import React, { useState, useMemo, useEffect } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";
import { getAgencies, deleteAgency } from "../services/mockApi";

function AgencyDirectory({ user, onLogout, onNavigate, onEditAgency, onViewAgency }) {
  const [searchName, setSearchName] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [districtFilter, setDistrictFilter] = useState("All Districts");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    getAgencies().then(setAgencies);
  }, []);

  const districts = useMemo(() => {
    const districtSet = new Set(agencies.map((a) => a.district));
    return ["All Districts", ...Array.from(districtSet)];
  }, [agencies]);

  const filteredAgencies = useMemo(() => {
    return agencies.filter((a) => {
      const matchName =
        !searchName ||
        a.name.toLowerCase().includes(searchName.toLowerCase());
      const matchType =
        typeFilter === "All Types" || a.type === typeFilter;
      const matchDistrict =
        districtFilter === "All Districts" || a.district === districtFilter;
      const matchPhone =
        !phoneFilter ||
        a.phone.replace(/\s|\(|\)|-/g, "").includes(phoneFilter.replace(/\D/g, ""));
      return matchName && matchType && matchDistrict && matchPhone;
    });
  }, [searchName, typeFilter, districtFilter, phoneFilter, agencies]);

  const handleDelete = (agency) => {
    if (!isAdmin) return;
    setDeleteId(agency.id);
    setDeleteName(agency.name);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteAgency(deleteId).then(() => {
      setAgencies((prev) => prev.filter((a) => a.id !== deleteId));
    });
    setDeleteId(null);
    setDeleteName("");
  };

  return (
    <MasterLayout
      currentPage="agency"
      user={user}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <div className="page-header">
        <h1>Agency Directory</h1>
        <p>View and search agencies</p>
      </div>

      <section className="debt-filters agency-filters">
        <div className="debt-filters-header">
          <h3>Filters</h3>
        </div>
        <div className="agency-filter-row">
          <div className="agency-search-wrapper">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <svg
              className="agency-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#94a3b8"
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All Types</option>
            <option>Type 1</option>
            <option>Type 2</option>
          </select>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />
        </div>
      </section>

      <section className="debt-table-section agency-table-section">
        <div className="agency-table-header">
          <h2>Agencies ({filteredAgencies.length})</h2>
          {isAdmin && (
            <button className="regulation-add-btn" onClick={() => onNavigate("add-agency")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>Add Agency</span>
            </button>
          )}
        </div>
        <div className="table-wrapper">
          <table className="debt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Agency Name</th>
                <th>Type</th>
                <th>District</th>
                <th>Phone</th>
                <th>Debt</th>
                <th>Received Date</th>
                {isAdmin && <th className="regulation-table-actions-header">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>
                  <td
                    className="agency-name agency-link-cell"
                    onClick={() => onViewAgency && onViewAgency(a)}
                    style={{ cursor: "pointer" }}
                  >
                    {a.name}
                  </td>
                  <td>{a.type}</td>
                  <td>{a.district}</td>
                  <td>{a.phone}</td>
                  <td className={a.debt > 30000 ? "agency-debt-high" : ""}>
                    ${a.debt.toLocaleString()}.00
                  </td>
                  <td>
                    {new Date(a.receivedDate).toLocaleDateString("en-GB")}
                  </td>
                  {isAdmin && (
                    <td className="regulation-table-actions">
                      <button
                        className="regulation-action-btn regulation-action-edit"
                        onClick={() => {
                          if (onEditAgency) onEditAgency(a);
                        }}
                        title="Update"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button
                        className="regulation-action-btn regulation-action-delete"
                        onClick={() => handleDelete(a)}
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isAdmin && deleteId && (
        <div className="regulation-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="regulation-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3>Delete Agency</h3>
            <p>Are you sure you want to delete <strong>"{deleteName}"</strong>? This action cannot be undone.</p>
            <div className="regulation-confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>
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

export default AgencyDirectory;


