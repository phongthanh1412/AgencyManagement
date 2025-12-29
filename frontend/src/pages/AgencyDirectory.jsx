import React, { useState, useMemo, useEffect } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { getAgencies, deleteAgency } from '../services/agencyService';

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
    setDeleteId(agency._id);
    setDeleteName(agency.name);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteAgency(deleteId).then(() => {
      setAgencies((prev) => prev.filter((a) => a._id !== deleteId));
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
                <tr key={a._id}>
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
                  <td className={a.currentDebt > 30000 ? "agency-debt-high" : ""}>
                    ${a.currentDebt.toLocaleString()}.00
                  </td>
                  <td>
                    {new Date(a.receiptDate).toLocaleDateString("en-GB")}
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.69 1.003l-2.657.615c-.961.222-1.777-.595-1.556-1.555l.615-2.657c.18-.78.527-1.487 1.003-1.69L16.862 4.487z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                        </svg>
                      </button>
                      <button
                        className="regulation-action-btn regulation-action-delete"
                        onClick={() => handleDelete(a)}
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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


