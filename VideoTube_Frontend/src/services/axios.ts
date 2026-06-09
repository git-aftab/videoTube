import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

// Attach token to every req
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if req fails with 401, tyr refreshing token once the retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orgReq = error.config;

    if (error.response?.status === 401 && !orgReq._retry) {
      orgReq._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1/"}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return api(orgReq);
      } catch (error) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
