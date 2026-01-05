import { API_URL, getAuthHeaders, handleResponse } from "./apiClient";

export const getRevenueReport = async (mode = "month") => {
  // Map common UI values to valid mode
  let queryMode = mode.toLowerCase();
  if (String(mode).includes("Month")) queryMode = "month";
  if (String(mode).includes("Year")) queryMode = "year";
  if (String(mode).includes("Week")) queryMode = "week";

  const response = await fetch(`${API_URL}/reports/revenue?mode=${queryMode}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getDebtReport = async (mode = "month", startDate = null, endDate = null) => {
  // Map common UI values to valid mode
  let queryMode = "month";
  if (String(mode).includes("Month")) queryMode = "month";
  if (String(mode).includes("Year")) queryMode = "year";
  if (String(mode).includes("Week")) queryMode = "week";

  let url = `${API_URL}/reports/debt?mode=${queryMode}`;
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
