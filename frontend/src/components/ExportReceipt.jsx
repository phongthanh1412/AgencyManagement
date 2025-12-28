import React, { useEffect, useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";
import { getAgencies } from '../services/agencyService';
import { getProducts } from '../services/productService';
import { createExportReceipt } from '../services/exportReceiptService';

// Units list constant
const unitsList = ["Box", "Carton", "Piece", "Set"];

function ExportReceipt({ user, onLogout, onNavigate, currentPage = 'export-receipt' }) {
  const [agencies, setAgencies] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [receiptDate, setReceiptDate] = useState("2025-07-19");
  const [products, setProducts] = useState([
    { id: 1, product: "", unit: "Box", quantity: 1, unitPrice: 0, amount: 0 }
  ]);

  useEffect(() => {
    Promise.all([
      getAgencies(),
      getProducts()
    ]).then(([agencyList, productList]) => {
      setAgencies(agencyList);
      setSelectedAgency(agencyList[0] || null);
      if (productList && productList.length > 0) {
        setProductsList(productList);
      }
    });

  }, []);

  const handleAgencyChange = (e) => {
    const agency = agencies.find(a => a.name === e.target.value);
    setSelectedAgency(agency);
  };

  const handleAddRow = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, {
      id: newId,
      productId: "",
      product: "",
      unit: "Box", // Default or empty
      quantity: 1,
      unitPrice: 0,
      amount: 0
    }]);
  };

  const handleDeleteRow = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        let updated = { ...p };

        if (field === 'productId') {
          const selectedProd = productsList.find(item => item._id === value);
          if (selectedProd) {
            updated.productId = selectedProd._id;
            updated.product = selectedProd.name;
            updated.unit = selectedProd.unit;
            updated.unitPrice = selectedProd.unitPrice;
            updated.amount = updated.quantity * selectedProd.unitPrice;
          }
        } else {
          updated[field] = value;
        }

        if (field === 'quantity' || field === 'unitPrice' || field === 'productId') {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return p;
    }));
  };

  const totalAmount = products.reduce((sum, p) => sum + p.amount, 0);
  const newDebt = selectedAgency ? (selectedAgency.debt || 0) + totalAmount : 0;
  const debtLimit = selectedAgency?.type === "Type 1" ? 20000 : 50000; // theo QĐ2

  const handleCreateReceipt = async () => {
    if (!selectedAgency) return;

    try {
      const payload = {
        agencyId: selectedAgency.id || selectedAgency._id,
        date: receiptDate,
        items: products.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice
        }))
      };

      await createExportReceipt(payload);

      alert(`Export Receipt Created for ${selectedAgency.name}!`);

      // Refresh agencies to update debt
      const list = await getAgencies();
      setAgencies(list);
      // Re-select current agency
      const updated = list.find((a) => (a.id === selectedAgency.id || a._id === selectedAgency._id));
      setSelectedAgency(updated || list[0] || null);

      // Reset form or navigate? Maybe keep it open.
      setProducts([{ id: 1, productId: "", product: "", unit: "Box", quantity: 1, unitPrice: 0, amount: 0 }]);

    } catch (error) {
      alert("Failed to create receipt: " + error.message);
    }
  };

  const handleCancel = () => {
    onNavigate('general');
  };

  return (
    <MasterLayout currentPage={currentPage} user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>Create Export Receipt</h1>
        <p>Create a new export receipt for an agency</p>
      </div>

      <div className="export-receipt-content">
        <div className="receipt-card">
          <h3 className="receipt-section-title">Receipt Information</h3>

          <div className="receipt-info-grid">
            <div className="input-group">
              <label>Agency <span className="required">*</span></label>
              <select value={selectedAgency?.name || ""} onChange={handleAgencyChange}>
                {agencies.map(agency => (
                  <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Receipt Date <span className="required">*</span></label>
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

          <div className="agency-info-row">
            <div className="agency-info-item">
              <div className="info-label">Address</div>
              <div className="info-value">{selectedAgency?.address || "—"}</div>
            </div>
            <div className="agency-info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">{selectedAgency?.phone || "—"}</div>
            </div>
            <div className="agency-info-item">
              <div className="info-label">Current Debt</div>
              <div className="info-value debt-amount">${(selectedAgency?.debt || 0).toLocaleString()}.00</div>
            </div>
          </div>
        </div>

        <div className="receipt-card">
          <div className="products-header">
            <h3 className="receipt-section-title">Products</h3>
            <button className="add-row-btn" onClick={handleAddRow}>
              <span>+</span> Add Row
            </button>
          </div>

          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>Product</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <select
                        value={product.productId || ""}
                        onChange={(e) => handleProductChange(product.id, 'productId', e.target.value)}
                        className="table-select"
                      >
                        <option value="" disabled>Select Product</option>
                        {productsList.map(p => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={product.unit}
                        onChange={(e) => handleProductChange(product.id, 'unit', e.target.value)}
                        className="table-select"
                      >
                        {unitsList.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(product.id, 'quantity', Number(e.target.value))}
                        className="table-input text-center"
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => handleProductChange(product.id, 'unitPrice', Number(e.target.value))}
                        className="table-input"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="amount-cell">${product.amount.toFixed(2)}</td>
                    <td className="text-center">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteRow(product.id)}
                        disabled={products.length === 1}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-summary">
            <div className="summary-row">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value total-value">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row debt-info">
              <span className="summary-label-small">
                New debt would be: ${newDebt.toLocaleString()}.00 / ${debtLimit.toLocaleString()}.00
              </span>
            </div>
          </div>

          <div className="receipt-actions">
            <button className="btn-primary" onClick={handleCreateReceipt}>
              Create Receipt
            </button>
            <button className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

export default ExportReceipt;