import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getAgencyTypes = async () => {
  const response = await fetch(`${API_URL}/agency-types`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createAgencyType = async (data) => {
  const response = await fetch(`${API_URL}/agency-types`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateAgencyType = async (id, data) => {
  const response = await fetch(`${API_URL}/agency-types/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteAgencyType = async (id) => {
  const response = await fetch(`${API_URL}/agency-types/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
