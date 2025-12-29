import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createProduct = async (data) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateProduct = async (id, data) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
