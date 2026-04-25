import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling 401 Unauthorized (Token Expiration)
api.interceptors.response.use(
  (response) => {
    // Return a successful response back to the calling function
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the refresh-token endpoint
        // The refresh token cookie will automatically be sent because of withCredentials: true
        await axios.post(
          'http://localhost:3000/api/v1/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        // If successful, retry the original request
        // The new access token will automatically be included in cookies
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token is expired or invalid)
        // Only show toast if it's not the initial load trying to get current user
        if (!originalRequest.url.includes('/auth/current-user')) {
          toast.error('Session expired. Please log in again.');
        }
        
        // Return a rejected promise
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors globally if needed
    if (error.response && error.response.status >= 500) {
      toast.error(error.response?.data?.message || 'A server error occurred.');
    }

    return Promise.reject(error);
  }
);

export default api;
