let envApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Remove trailing slash if present
envApiUrl = envApiUrl.replace(/\/$/, "");
// Append /api if missing (assumes backend always prefixes with /api)
if (!envApiUrl.endsWith("/api")) {
  envApiUrl += "/api";
}
const API_URL = envApiUrl;

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

export { API_URL, getAuthHeaders, handleResponse };
