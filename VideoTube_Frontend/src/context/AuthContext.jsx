import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.post('/auth/current-user');
        if (response.data?.success) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        // Not logged in or token expired and refresh failed
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.success) {
      setCurrentUser(response.data.data.user);
    }
    return response.data;
  };

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
