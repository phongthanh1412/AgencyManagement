import React, { useMemo, useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";

const receiptsMock = [
  {
    id: 1,
    code: "EXP-2024-005",
    agency: "Silver Moon Supplies",
    date: "2024-05-03",
    total: 5000,
    items: 3,
    itemsDetails: [
      { no: 1, product: "Product A", unit: "Box", quantity: 10, unitPrice: 200, amount: 2000 },
      { no: 2, product: "Product B", unit: "Carton", quantity: 10, unitPrice: 150, amount: 1500 },
      { no: 3, product: "Product C", unit: "Box", quantity: 10, unitPrice: 150, amount: 1500 },
    ],
  },
  {
    id: 2,
    code: "EXP-2024-004",
    agency: "Blue Ocean Distributors",
    date: "2024-04-30",
    total: 20000,
    items: 8,
    itemsDetails: [
      { no: 1, product: "Product A", unit: "Box", quantity: 50, unitPrice: 200, amount: 10000 },
      { no: 2, product: "Product B", unit: "Carton", quantity: 25, unitPrice: 200, amount: 5000 },
      { no: 3, product: "Product C", unit: "Box", quantity: 20, unitPrice: 250, amount: 5000 },
    ],
  },
  {
    id: 3,
    code: "EXP-2024-003",
    agency: "Golden Star Trading Co.",
    date: "2024-04-27",
    total: 15000,
    items: 3,
    itemsDetails: [
      { no: 1, product: "Product A", unit: "Box", quantity: 50, unitPrice: 200, amount: 10000 },
      { no: 2, product: "Product B", unit: "Carton", quantity: 20, unitPrice: 250, amount: 5000 },
    ],
  },
  {
    id: 4,
    code: "EXP-2024-002",
    agency: "Red Dragon Imports",
    date: "2024-04-01",
    total: 1500,
    items: 1,
    itemsDetails: [
      { no: 1, product: "Product A", unit: "Box", quantity: 15, unitPrice: 100, amount: 1500 },
    ],
  },
  {
    id: 5,
    code: "EXP-2024-001",
    agency: "Sunset Trading Hub",
    date: "2024-03-01",
    total: 9500,
    items: 2,
    // Match the sample screenshot: 50 * 100 + 30 * 150 = 9,500
    itemsDetails: [
      { no: 1, product: "Product A", unit: "Box", quantity: 50, unitPrice: 100, amount: 5000 },
      { no: 2, product: "Product B", unit: "Carton", quantity: 30, unitPrice: 150, amount: 4500 },
    ],
  },
];

function ExportReceiptList({ user, onLogout, onNavigate }) {
  const [searchCode, setSearchCode] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("All Agencies");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const agencies = useMemo(
    () => ["All Agencies", ...Array.from(new Set(receiptsMock.map((r) => r.agency)))],
    []
  );

  const filteredReceipts = useMemo(() => {
    return receiptsMock.filter((r) => {
      const matchCode =
        !searchCode || r.code.toLowerCase().includes(searchCode.toLowerCase());
      const matchAgency =
        agencyFilter === "All Agencies" || r.agency === agencyFilter;
      const matchFrom = !fromDate || new Date(r.date) >= new Date(fromDate);
      const matchTo = !toDate || new Date(r.date) <= new Date(toDate);
      return matchCode && matchAgency && matchFrom && matchTo;
    });
  }, [searchCode, agencyFilter, fromDate, toDate]);

  return (
    <MasterLayout
      currentPage="export-receipt"
      user={user}
      onLogout={onLogout}
      onNavigate={onNavigate}
    >
      <div className="page-header">
        <h1>Export Receipt</h1>
        <p>Search and view export receipts</p>
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
          <h2>Export Receipts ({filteredReceipts.length})</h2>
        </div>
        <div className="table-wrapper">
          <table className="debt-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Receipt Code</th>
                <th>Agency</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.map((r, index) => (
                <tr
                  key={r.id}
                  className="clickable-row"
                  onClick={() => setSelectedReceipt(r)}
                >
                  <td>{index + 1}</td>
                  <td>{r.code}</td>
                  <td>{r.agency}</td>
                  <td>{new Date(r.date).toLocaleDateString("en-GB")}</td>
                  <td>${r.total.toLocaleString()}.00</td>
                  <td>{r.items} items</td>
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
              <h3>Export Receipt Details</h3>
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
                  <div className="info-value">{selectedReceipt.code}</div>
                  <div className="info-label" style={{ marginTop: 16 }}>Agency Name</div>
                  <div className="info-value">{selectedReceipt.agency}</div>
                </div>
                <div className="receipt-detail-card">
                  <div className="info-label">Date Created</div>
                  <div className="info-value">
                    {new Date(selectedReceipt.date).toLocaleDateString("en-GB")}
                  </div>
                  <div className="info-label" style={{ marginTop: 16 }}>Total Amount</div>
                  <div className="info-value total-value">
                    ${selectedReceipt.total.toLocaleString()}.00
                  </div>
                </div>
              </div>

              <h4 className="receipt-detail-items-title">Items</h4>

              <div className="table-wrapper">
                <table className="debt-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Product</th>
                      <th>Unit</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedReceipt.itemsDetails || []).map((item) => (
                      <tr key={item.no}>
                        <td>{item.no}</td>
                        <td>{item.product}</td>
                        <td>{item.unit}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unitPrice.toLocaleString()}.00</td>
                        <td>${item.amount.toLocaleString()}.00</td>
                      </tr>
                    ))}
                    <tr className="debt-table-total">
                      <td colSpan={5} style={{ textAlign: "right" }}>
                        <strong>Total Amount:</strong>
                      </td>
                      <td>
                        <strong>${selectedReceipt.total.toLocaleString()}.00</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

export default ExportReceiptList;


