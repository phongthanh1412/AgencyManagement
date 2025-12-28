import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getExportReceipts = async () => {
  const response = await fetch(`${API_URL}/export-receipts`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getExportReceiptDetail = async (id) => {
  const response = await fetch(`${API_URL}/export-receipts/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createExportReceipt = async (data) => {
  const response = await fetch(`${API_URL}/export-receipts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
