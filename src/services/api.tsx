import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

// Request interceptor to add auth and org headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const orgId = localStorage.getItem("orgId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (orgId && !config.url?.includes("orgs/createOrg")) {
    config.headers["x-org-id"] = orgId;
  }

  return config;
});


API.interceptors.response.use(
  (res) => res,
  (err) => {
    const requestUrl = err.config?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/user/login") ||
      requestUrl.includes("/user/register") ||
      requestUrl.includes("/user/forgot-password") ||
      requestUrl.includes("/user/reset-password");

    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);
export default API;
