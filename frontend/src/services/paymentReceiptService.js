import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getPaymentReceipts = async () => {
  const response = await fetch(`${API_URL}/payment-receipts`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createPaymentReceipt = async (data) => {
  const response = await fetch(`${API_URL}/payment-receipts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
