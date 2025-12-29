import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getAgencies = async () => {
  const response = await fetch(`${API_URL}/agencies`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createAgency = async (agencyData) => {
  const response = await fetch(`${API_URL}/agencies`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(agencyData),
  });
  return handleResponse(response);
};

export const updateAgency = async (id, agencyData) => {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(agencyData),
  });
  return handleResponse(response);
};

export const deleteAgency = async (id) => {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getAgencyById = async (id) => {
  const response = await fetch(`${API_URL}/agencies/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getExportReceiptsByAgency = async (agencyId) => {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/export-receipts`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getPaymentReceiptsByAgency = async (agencyId) => {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/payment-receipts`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getDebtHistoryByAgency = async (agencyId) => {
  const response = await fetch(`${API_URL}/agencies/${agencyId}/debt-histories`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
