import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
