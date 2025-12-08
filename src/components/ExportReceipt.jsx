import React, { useState } from "react";
import MasterLayout from "./MasterLayout";
import "../App.css";

const agencies = [
  { 
    id: 1, 
    name: "Golden Star Trading Co.", 
    address: "123 Main Street, District 1",
    phone: "(555) 123-4567",
    currentDebt: 25000
  },
  { 
    id: 2, 
    name: "Blue Ocean Distributors",
    address: "456 Ocean Ave, District 2", 
    phone: "(555) 234-5678",
    currentDebt: 42000
  },
  { 
    id: 3, 
    name: "Red Dragon Imports",
    address: "789 Dragon St, District 3",
    phone: "(555) 345-6789", 
    currentDebt: 31000
  }
];

const productsList = ["Product A", "Product B", "Product C", "Product D"];
const unitsList = ["Box", "Carton", "Piece", "Set"];

function ExportReceipt({ user, onLogout, onNavigate, currentPage = 'export-receipt' }) {
  const [selectedAgency, setSelectedAgency] = useState(agencies[0]);
  const [receiptDate, setReceiptDate] = useState("19/07/2025");
  const [products, setProducts] = useState([
    { id: 1, product: "Product A", unit: "Box", quantity: 2, unitPrice: 100, amount: 200 },
    { id: 2, product: "Product B", unit: "Carton", quantity: 1, unitPrice: 150, amount: 150 }
  ]);

  const handleAgencyChange = (e) => {
    const agency = agencies.find(a => a.name === e.target.value);
    setSelectedAgency(agency);
  };

  const handleAddRow = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, {
      id: newId,
      product: "Product A",
      unit: "Box",
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
        const updated = { ...p, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return p;
    }));
  };

  const totalAmount = products.reduce((sum, p) => sum + p.amount, 0);
  const newDebt = selectedAgency.currentDebt + totalAmount;
  const debtLimit = 50000;

  const handleCreateReceipt = () => {
    alert(`Export Receipt Created!\nAgency: ${selectedAgency.name}\nTotal Amount: $${totalAmount.toFixed(2)}`);
    // Add your API call here
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
              <select value={selectedAgency.name} onChange={handleAgencyChange}>
                {agencies.map(agency => (
                  <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
              </select>
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

          <div className="agency-info-row">
            <div className="agency-info-item">
              <div className="info-label">Address</div>
              <div className="info-value">{selectedAgency.address}</div>
            </div>
            <div className="agency-info-item">
              <div className="info-label">Phone</div>
              <div className="info-value">{selectedAgency.phone}</div>
            </div>
            <div className="agency-info-item">
              <div className="info-label">Current Debt</div>
              <div className="info-value debt-amount">${selectedAgency.currentDebt.toLocaleString()}.00</div>
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
                    <th style={{width: '60px'}}>No.</th>
                    <th>Product</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th style={{width: '60px'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <select 
                          value={product.product}
                          onChange={(e) => handleProductChange(product.id, 'product', e.target.value)}
                          className="table-select"
                        >
                          {productsList.map(p => (
                            <option key={p} value={p}>{p}</option>
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
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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