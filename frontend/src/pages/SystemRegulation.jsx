import React, { useState, useEffect } from "react";
import MasterLayout from "../components/Layout";
import "../App.css";
import { getSystemRegulation, updateSystemRegulation } from "../services/systemRegulationService";
import { getAgencyTypes, createAgencyType, updateAgencyType, deleteAgencyType } from "../services/agencyTypeService";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productService";

function SystemRegulation({ user, onLogout, onNavigate }) {
  const [maxDistricts, setMaxDistricts] = useState(0);
  const [maxAgenciesPerDistrict, setMaxAgenciesPerDistrict] = useState(0);
  const [editingDistrict, setEditingDistrict] = useState(false);
  const [editingAgencies, setEditingAgencies] = useState(false);
  const [tempDistrict, setTempDistrict] = useState("");
  const [tempAgencies, setTempAgencies] = useState("");

  const [agencyTypes, setAgencyTypes] = useState([]);
  const [editingType, setEditingType] = useState(null);
  const [showAddTypeForm, setShowAddTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDebt, setNewTypeDebt] = useState("");

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", unit: "", unitPrice: "" });
  const [deleteTypeId, setDeleteTypeId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const regulation = await getSystemRegulation();
      if (regulation) {
        setMaxDistricts(regulation.maxDistrict);
        setMaxAgenciesPerDistrict(regulation.maxAgencyPerDistrict);
        setTempDistrict(regulation.maxDistrict.toString());
        setTempAgencies(regulation.maxAgencyPerDistrict.toString());
      }

      const types = await getAgencyTypes();
      setAgencyTypes(types || []);

      const prods = await getProducts();
      setProducts(prods || []);
    } catch (error) {
      console.error("Failed to fetch system data:", error);
    }
  };

  const handleSaveDistrict = async () => {
    const value = parseInt(tempDistrict);
    if (value > 0) {
      try {
        await updateSystemRegulation({
          maxDistrict: value,
          maxAgencyPerDistrict: maxAgenciesPerDistrict
        });
        setMaxDistricts(value);
        setEditingDistrict(false);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleSaveAgencies = async () => {
    const value = parseInt(tempAgencies);
    if (value > 0) {
      try {
        await updateSystemRegulation({
          maxDistrict: maxDistricts,
          maxAgencyPerDistrict: value
        });
        setMaxAgenciesPerDistrict(value);
        setEditingAgencies(false);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleAddAgencyType = async () => {
    if (newTypeName && newTypeDebt) {
      try {
        const newType = await createAgencyType({
          name: newTypeName,
          maxDebt: parseFloat(newTypeDebt.replace(/[^0-9.]/g, ''))
        });
        setAgencyTypes([...agencyTypes, newType]);
        setNewTypeName("");
        setNewTypeDebt("");
        setShowAddTypeForm(false);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleEditAgencyType = (type) => {
    setEditingType(type._id);
    setNewTypeName(type.name);
    setNewTypeDebt(type.maxDebt.toString());
  };

  const handleSaveAgencyType = async () => {
    if (newTypeName && newTypeDebt) {
      try {
        const updated = await updateAgencyType(editingType, {
          name: newTypeName,
          maxDebt: parseFloat(newTypeDebt.replace(/[^0-9.]/g, ''))
        });
        setAgencyTypes(agencyTypes.map(t =>
          t._id === editingType ? updated : t
        ));
        setEditingType(null);
        setNewTypeName("");
        setNewTypeDebt("");
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleDeleteAgencyType = (id) => {
    setDeleteTypeId(id);
  };

  const confirmDeleteAgencyType = async () => {
    if (deleteTypeId) {
      try {
        await deleteAgencyType(deleteTypeId);
        setAgencyTypes(agencyTypes.filter(t => t._id !== deleteTypeId));
        setDeleteTypeId(null);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.unit && newProduct.unitPrice) {
      try {
        const newP = await createProduct({
          name: newProduct.name,
          unit: newProduct.unit,
          unitPrice: parseFloat(newProduct.unitPrice)
        });
        setProducts([...products, newP]);
        setNewProduct({ name: "", unit: "", unitPrice: "" });
        setShowAddProduct(false);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setNewProduct({ name: product.name, unit: product.unit, unitPrice: product.unitPrice.toString() });
  };

  const handleSaveProduct = async () => {
    if (newProduct.name && newProduct.unit && newProduct.unitPrice) {
      try {
        const updated = await updateProduct(editingProduct, {
          name: newProduct.name,
          unit: newProduct.unit,
          unitPrice: parseFloat(newProduct.unitPrice)
        });
        setProducts(products.map(p =>
          p._id === editingProduct ? updated : p
        ));
        setEditingProduct(null);
        setNewProduct({ name: "", unit: "", unitPrice: "" });
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    }
  };

  const handleDeleteProduct = (id) => {
    setDeleteProductId(id);
  };

  const confirmDeleteProduct = async () => {
    if (deleteProductId) {
      try {
        await deleteProduct(deleteProductId);
        setProducts(products.filter(p => p._id !== deleteProductId));
        setDeleteProductId(null);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.69 1.003l-2.657.615c-.961.222-1.777-.595-1.556-1.555l.615-2.657c.18-.78.527-1.487 1.003-1.69L16.862 4.487z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.69 1.003l-2.657.615c-.961.222-1.777-.595-1.556-1.555l.615-2.657c.18-.78.527-1.487 1.003-1.69L16.862 4.487z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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
                  <tr key={type._id} className={editingType === type._id ? "regulation-row-editing" : ""}>
                    <td>
                      <span className="regulation-table-text">{type.name}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">${type.maxDebt.toLocaleString()}.00</span>
                    </td>
                    <td className="regulation-table-actions">
                      <button className="regulation-action-btn regulation-action-edit" onClick={() => handleEditAgencyType(type)} title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.69 1.003l-2.657.615c-.961.222-1.777-.595-1.556-1.555l.615-2.657c.18-.78.527-1.487 1.003-1.69L16.862 4.487z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                        </svg>
                      </button>
                      <button className="regulation-action-btn regulation-action-delete" onClick={() => handleDeleteAgencyType(type._id)} title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
              </svg>
              Product Management
            </h3>
            <p className="regulation-section-subtitle">
              Add and manage products with pricing and unit types.
            </p>
          </div>
          <button className="regulation-add-btn" onClick={() => setShowAddProduct(!showAddProduct)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    >
                      <option value="">Select unit type</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="unit">unit</option>
                      <option value="box">box</option>
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
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    >
                      <option value="">Select unit type</option>
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="unit">unit</option>
                      <option value="box">box</option>
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
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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
                  <tr key={product._id} className={editingProduct === product._id ? "regulation-row-editing" : ""}>
                    <td>
                      <span className="regulation-table-text">{product.name}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">{product.unit}</span>
                    </td>
                    <td>
                      <span className="regulation-table-text">${product.unitPrice.toLocaleString()}.00</span>
                    </td>
                    <td className="regulation-table-actions">
                      <button className="regulation-action-btn regulation-action-edit" onClick={() => handleEditProduct(product)} title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.69 1.003l-2.657.615c-.961.222-1.777-.595-1.556-1.555l.615-2.657c.18-.78.527-1.487 1.003-1.69L16.862 4.487z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.862 4.487" />
                        </svg>
                      </button>
                      <button className="regulation-action-btn regulation-action-delete" onClick={() => handleDeleteProduct(product._id)} title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
        const typeToDelete = agencyTypes.find(t => t._id === deleteTypeId);
        return (
          <div className="regulation-modal-overlay" onClick={() => setDeleteTypeId(null)}>
            <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-confirm-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
        const productToDelete = products.find(p => p._id === deleteProductId);
        return (
          <div className="regulation-modal-overlay" onClick={() => setDeleteProductId(null)}>
            <div className="regulation-confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="regulation-confirm-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

export default SystemRegulation;
