import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getSystemRegulation = async () => {
    const response = await fetch(`${API_URL}/system-regulation`, {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const updateSystemRegulation = async (data) => {
    const response = await fetch(`${API_URL}/system-regulation`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};
