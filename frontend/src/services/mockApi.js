
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
    // Try to parse JSON error
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || 'API Error');
    } catch (e) {
      throw new Error(errorText || `API Error: ${response.status}`);
    }
  }
  return response.json();
};

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

export async function getExportReceiptsByAgency(id) {
  const response = await fetch(`${API_URL}/agencies/${id}/export-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getExportReceipts() {
  const response = await fetch(`${API_URL}/export-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getPaymentReceiptsByAgency(id) {
  const response = await fetch(`${API_URL}/agencies/${id}/payment-receipts`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

export async function getDebtHistoryByAgency(id) {
  const response = await fetch(`${API_URL}/agencies/${id}/debt-histories`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// Product Management
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders()
  });
  const data = await handleResponse(response);
  
  return data;
}

export const productsList = ["Product A", "Product B", "Product C", "Product D"];
export const unitsList = ["Box", "Carton", "Piece", "Set"];
