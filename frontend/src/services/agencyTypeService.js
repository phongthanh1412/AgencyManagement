import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getAgencyTypes = async () => {
  const response = await fetch(`${API_URL}/agency-types`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
