import React, { useState } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";

function SystemRegulation({ user, onLogout, onNavigate }) {
  const [maxDistricts, setMaxDistricts] = useState(20);
  const [maxAgenciesPerDistrict, setMaxAgenciesPerDistrict] = useState(4);
  const [editingDistrict, setEditingDistrict] = useState(false);
  const [editingAgencies, setEditingAgencies] = useState(false);
  const [tempDistrict, setTempDistrict] = useState("20");
  const [tempAgencies, setTempAgencies] = useState("4");

  const [agencyTypes, setAgencyTypes] = useState([
    { id: 1, name: "Type 1", maxDebt: 50000 },
    { id: 2, name: "Type 2", maxDebt: 20000 },
  ]);
  const [editingType, setEditingType] = useState(null);
  const [showAddTypeForm, setShowAddTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDebt, setNewTypeDebt] = useState("");

  const [products, setProducts] = useState([
    { id: 1, name: "Product A", unitType: "kg", unitPrice: 100 },
    { id: 2, name: "Product B", unitType: "liter", unitPrice: 150 },
    { id: 3, name: "Product C", unitType: "kg", unitPrice: 200 },
    { id: 4, name: "Product D", unitType: "unit", unitPrice: 250 },
    { id: 5, name: "Product E", unitType: "kg", unitPrice: 300 },
  ]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", unitType: "", unitPrice: "" });
  const [deleteTypeId, setDeleteTypeId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const handleSaveDistrict = () => {
    const value = parseInt(tempDistrict);
    if (value > 0) {
      setMaxDistricts(value);
      setEditingDistrict(false);
    }
  };

  const handleSaveAgencies = () => {
    const value = parseInt(tempAgencies);
    if (value > 0) {
      setMaxAgenciesPerDistrict(value);
      setEditingAgencies(false);
    }
  };

  const handleAddAgencyType = () => {
    if (newTypeName && newTypeDebt) {
      const newId = Math.max(...agencyTypes.map(t => t.id), 0) + 1;
      setAgencyTypes([...agencyTypes, {
        id: newId,
        name: newTypeName,
        maxDebt: parseFloat(newTypeDebt.replace(/[^0-9.]/g, ''))
      }]);
      setNewTypeName("");
      setNewTypeDebt("");
      setShowAddTypeForm(false);
    }
  };

  const handleEditAgencyType = (type) => {
    setEditingType(type.id);
    setNewTypeName(type.name);
    setNewTypeDebt(type.maxDebt.toString());
  };

  const handleSaveAgencyType = () => {
    if (newTypeName && newTypeDebt) {
      setAgencyTypes(agencyTypes.map(t =>
        t.id === editingType
          ? { ...t, name: newTypeName, maxDebt: parseFloat(newTypeDebt.replace(/[^0-9.]/g, '')) }
          : t
      ));
      setEditingType(null);
      setNewTypeName("");
      setNewTypeDebt("");
    }
  };

  const handleDeleteAgencyType = (id) => {
    setDeleteTypeId(id);
  };

  const confirmDeleteAgencyType = () => {
    if (deleteTypeId) {
      setAgencyTypes(agencyTypes.filter(t => t.id !== deleteTypeId));
      setDeleteTypeId(null);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.unitType && newProduct.unitPrice) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, {
        id: newId,
        ...newProduct,
        unitPrice: parseFloat(newProduct.unitPrice)
      }]);
      setNewProduct({ name: "", unitType: "", unitPrice: "" });
      setShowAddProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setNewProduct({ name: product.name, unitType: product.unitType, unitPrice: product.unitPrice.toString() });
  };

  const handleSaveProduct = () => {
    if (newProduct.name && newProduct.unitType && newProduct.unitPrice) {
      setProducts(products.map(p =>
        p.id === editingProduct
          ? { ...p, ...newProduct, unitPrice: parseFloat(newProduct.unitPrice) }
          : p
      ));
      setEditingProduct(null);
      setNewProduct({ name: "", unitType: "", unitPrice: "" });
    }
  };

  const handleDeleteProduct = (id) => {
    setDeleteProductId(id);
  };

  const confirmDeleteProduct = () => {
    if (deleteProductId) {
      setProducts(products.filter(p => p.id !== deleteProductId));
      setDeleteProductId(null);
    }
  };

  return (
    <MasterLayout currentPage="system-regulation" user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="page-header">
        <h1>System Regulations</h1>
        <p>Configure system rules and constraints</p>
      </div>

      {/* Basic Agency Rules */}
      <div className="regulation-card">
        <div className="regulation-card-header">
          <div className="regulation-title-group">
            <h3 className="regulation-section-title">Basic Agency Rules</h3>
            <p className="regulation-section-subtitle">
              Manage core agency-related regulations and constraints.
            </p>
          </div>
        </div>
        
        <div className="regulation-fields-horizontal">
          <div className="regulation-field-item-horizontal">
            <label className="regulation-field-label">Maximum Districts</label>
            <div className="regulation-value-with-edit">
              <span className="regulation-display-text">{maxDistricts}</span>
              <button className="regulation-icon-btn regulation-edit-icon" onClick={() => {
                setEditingDistrict(true);
                setTempDistrict(maxDistricts.toString());
              }} title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="regulation-field-item-horizontal">
            <label className="regulation-field-label">Max Agencies per District</label>
            <div className="regulation-value-with-edit">
              <span className="regulation-display-text">{maxAgenciesPerDistrict}</span>
              <button className="regulation-icon-btn regulation-edit-icon" onClick={() => {
                setEditingAgencies(true);
                setTempAgencies(maxAgenciesPerDistrict.toString());
              }} title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {editingDistrict && (
          <div className="regulation-modal-overlay" onClick={() => {
            setEditingDistrict(false);
            setTempDistrict(maxDistricts.toString());
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Edit Maximum Districts</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setEditingDistrict(false);
                  setTempDistrict(maxDistricts.toString());
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="input-group">
                  <label>Maximum Districts <span className="required">*</span></label>
                  <input
                    type="number"
                    value={tempDistrict}
                    onChange={(e) => setTempDistrict(e.target.value)}
                    placeholder="Enter maximum districts"
                    min="1"
                    autoFocus
                  />
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setEditingDistrict(false);
                  setTempDistrict(maxDistricts.toString());
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveDistrict}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {editingAgencies && (
          <div className="regulation-modal-overlay" onClick={() => {
            setEditingAgencies(false);
            setTempAgencies(maxAgenciesPerDistrict.toString());
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Edit Max Agencies per District</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setEditingAgencies(false);
                  setTempAgencies(maxAgenciesPerDistrict.toString());
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="input-group">
                  <label>Max Agencies per District <span className="required">*</span></label>
                  <input
                    type="number"
                    value={tempAgencies}
                    onChange={(e) => setTempAgencies(e.target.value)}
                    placeholder="Enter max agencies per district"
                    min="1"
                    autoFocus
                  />
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setEditingAgencies(false);
                  setTempAgencies(maxAgenciesPerDistrict.toString());
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveAgencies}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agency Types */}
      <div className="regulation-card">
        <div className="regulation-card-header">
          <div>
            <h3 className="regulation-section-title">Agency Types</h3>
            <p className="regulation-section-subtitle">
              Define agency types and their maximum debt limits.
            </p>
          </div>
          <button className="regulation-add-btn" onClick={() => setShowAddTypeForm(!showAddTypeForm)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Add New Agency Type</span>
          </button>
        </div>

        {showAddTypeForm && (
          <div className="regulation-modal-overlay" onClick={() => {
            setShowAddTypeForm(false);
            setNewTypeName("");
            setNewTypeDebt("");
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Add New Agency Type</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setShowAddTypeForm(false);
                  setNewTypeName("");
                  setNewTypeDebt("");
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="regulation-form-grid">
                  <div className="input-group">
                    <label>Type Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="Enter type name"
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label>Max Debt <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newTypeDebt}
                      onChange={(e) => setNewTypeDebt(e.target.value)}
                      placeholder="$0.00"
                    />
                  </div>
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setShowAddTypeForm(false);
                  setNewTypeName("");
                  setNewTypeDebt("");
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddAgencyType}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Type
                </button>
              </div>
            </div>
          </div>
        )}

        {editingType && (
          <div className="regulation-modal-overlay" onClick={() => {
            setEditingType(null);
            setNewTypeName("");
            setNewTypeDebt("");
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Edit Agency Type</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setEditingType(null);
                  setNewTypeName("");
                  setNewTypeDebt("");
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="regulation-form-grid">
                  <div className="input-group">
                    <label>Type Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="Enter type name"
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label>Max Debt <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newTypeDebt}
                      onChange={(e) => setNewTypeDebt(e.target.value)}
                      placeholder="$0.00"
                    />
                  </div>
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setEditingType(null);
                  setNewTypeName("");
                  setNewTypeDebt("");
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveAgencyType}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {agencyTypes.length > 0 ? (
          <div className="regulation-table-container">
            <table className="regulation-table">
              <thead>
                <tr>
                  <th>Type Name</th>
                  <th>Max Debt for this Type</th>
                  <th className="regulation-table-actions-header"></th>
                </tr>
              </thead>
              <tbody>
                {agencyTypes.map((type) => (
                  <tr key={type.id} className={editingType === type.id ? "regulation-row-editing" : ""}>
                    <td>
                      <span className="regulation-table-text">{type.name}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">${type.maxDebt.toLocaleString()}.00</span>
                    </td>
                    <td className="regulation-table-actions">
                      <button className="regulation-action-btn regulation-action-edit" onClick={() => handleEditAgencyType(type)} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button className="regulation-action-btn regulation-action-delete" onClick={() => handleDeleteAgencyType(type.id)} title="Delete">
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
        ) : (
          <div className="regulation-empty-state">
            No agency types. Click "Add New Agency Type" to create one.
          </div>
        )}
      </div>

      {/* Product Management */}
      <div className="regulation-card">
        <div className="regulation-card-header">
          <div>
            <h3 className="regulation-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
              </svg>
              Product Management
            </h3>
            <p className="regulation-section-subtitle">
              Add and manage products with pricing and unit types.
            </p>
          </div>
          <button className="regulation-add-btn" onClick={() => setShowAddProduct(!showAddProduct)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Add New Product</span>
          </button>
        </div>

        {showAddProduct && (
          <div className="regulation-modal-overlay" onClick={() => {
            setShowAddProduct(false);
            setNewProduct({ name: "", unitType: "", unitPrice: "" });
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Add New Product</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setShowAddProduct(false);
                  setNewProduct({ name: "", unitType: "", unitPrice: "" });
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="regulation-form-grid">
                  <div className="input-group">
                    <label>Product Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label>Unit Type <span className="required">*</span></label>
                    <select
                      value={newProduct.unitType}
                      onChange={(e) => setNewProduct({ ...newProduct, unitType: e.target.value })}
                    >
                      <option value="">Select unit type</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="unit">unit</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Unit Price <span className="required">*</span></label>
                    <input
                      type="number"
                      value={newProduct.unitPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setShowAddProduct(false);
                  setNewProduct({ name: "", unitType: "", unitPrice: "" });
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleAddProduct}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}

        {editingProduct && (
          <div className="regulation-modal-overlay" onClick={() => {
            setEditingProduct(null);
            setNewProduct({ name: "", unitType: "", unitPrice: "" });
          }}>
            <div className="regulation-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-modal-header">
                <h3>Edit Product</h3>
                <button className="regulation-modal-close" onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ name: "", unitType: "", unitPrice: "" });
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <div className="regulation-modal-body">
                <div className="regulation-form-grid">
                  <div className="input-group">
                    <label>Product Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                      autoFocus
                    />
                  </div>
                  <div className="input-group">
                    <label>Unit Type <span className="required">*</span></label>
                    <select
                      value={newProduct.unitType}
                      onChange={(e) => setNewProduct({ ...newProduct, unitType: e.target.value })}
                    >
                      <option value="">Select unit type</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="unit">unit</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Unit Price <span className="required">*</span></label>
                    <input
                      type="number"
                      value={newProduct.unitPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="regulation-modal-footer">
                <button className="btn-secondary" onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({ name: "", unitType: "", unitPrice: "" });
                }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveProduct}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <div className="regulation-table-container">
            <table className="regulation-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Unit Type</th>
                  <th>Unit Price</th>
                  <th className="regulation-table-actions-header"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={editingProduct === product.id ? "regulation-row-editing" : ""}>
                    <td>
                      <span className="regulation-table-text">{product.name}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">{product.unitType}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">${product.unitPrice.toLocaleString()}.00</span>
                    </td>
                    <td className="regulation-table-actions">
                      <button className="regulation-action-btn regulation-action-edit" onClick={() => handleEditProduct(product)} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button className="regulation-action-btn regulation-action-delete" onClick={() => handleDeleteProduct(product.id)} title="Delete">
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
        ) : (
          <div className="regulation-empty-state">
            No products. Click "Add New Product" to create one.
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup for Agency Type */}
      {deleteTypeId && (() => {
        const typeToDelete = agencyTypes.find(t => t.id === deleteTypeId);
        return (
          <div className="regulation-modal-overlay" onClick={() => setDeleteTypeId(null)}>
            <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-confirm-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <h3>Delete Agency Type</h3>
              <p>Are you sure you want to delete <strong>"{typeToDelete?.name}"</strong>? This action cannot be undone.</p>
              <div className="regulation-confirm-actions">
                <button className="btn-secondary" onClick={() => setDeleteTypeId(null)}>
                  No
                </button>
                <button className="btn-danger" onClick={confirmDeleteAgencyType}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Confirmation Popup for Product */}
      {deleteProductId && (() => {
        const productToDelete = products.find(p => p.id === deleteProductId);
        return (
          <div className="regulation-modal-overlay" onClick={() => setDeleteProductId(null)}>
            <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-confirm-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </div>
              <h3>Delete Product</h3>
              <p>Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.</p>
              <div className="regulation-confirm-actions">
                <button className="btn-secondary" onClick={() => setDeleteProductId(null)}>
                  No
                </button>
                <button className="btn-danger" onClick={confirmDeleteProduct}>
                  Yes
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </MasterLayout>
  );
}

export default SystemRegulation;
