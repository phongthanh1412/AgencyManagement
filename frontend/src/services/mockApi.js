
const API_URL = 'http://localhost:3000/api';

// Helper to get auth header
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = user?.token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'API Error');
    } catch (e) {
      throw new Error(errorText || `API Error: ${response.status}`);
    }
  }
  return response.json();
};

// Auth
export async function login(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
}

export async function register(data) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

// Agencies
export async function getAgencies() {
  const response = await fetch(`${API_URL}/agencies`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getAgencyById(id) {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function createAgency(data) {
  const response = await fetch(`${API_URL}/agencies`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function updateAgency(id, data) {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteAgency(id) {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Agency Types
export async function getAgencyTypes() {
  const response = await fetch(`${API_URL}/agency-types`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function createAgencyType(data) {
  const response = await fetch(`${API_URL}/agency-types`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function updateAgencyType(id, data) {
  const response = await fetch(`${API_URL}/agency-types/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteAgencyType(id) {
  const response = await fetch(`${API_URL}/agency-types/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Products
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function createProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Receipts
export async function createExportReceipt(data) {
  const response = await fetch(`${API_URL}/export-receipts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getExportReceipts() {
  const response = await fetch(`${API_URL}/export-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getExportReceiptDetail(id) {
  const response = await fetch(`${API_URL}/export-receipts/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getExportReceiptsByAgency(agencyId) {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/export-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Payment Receipts
export async function createPaymentReceipt(data) {
  const response = await fetch(`${API_URL}/payment-receipts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

export async function getPaymentReceipts() {
  const response = await fetch(`${API_URL}/payment-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getPaymentReceiptsByAgency(agencyId) {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/payment-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Debt History
export async function getDebtHistoryByAgency(agencyId) {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/debt-histories`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Reports
export async function getRevenueReport() {
  const response = await fetch(`${API_URL}/reports/revenue`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getDebtReport() {
  const response = await fetch(`${API_URL}/reports/debt`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// System Regulation
export async function getSystemRegulation() {
  const response = await fetch(`${API_URL}/system-regulation`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function updateSystemRegulation(data) {
  const response = await fetch(`${API_URL}/system-regulation`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

// Legacy exports to prevent breaking imports (empty arrays/dummies)
export const productsList = [];
export const unitsList = ["Box", "Carton", "Piece", "Set"]; // Keeping defaults or fetch dynamically
