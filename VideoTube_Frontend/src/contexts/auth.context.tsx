import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";
import type { ReactNode } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null; //logged-in user, or null if guest
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User) => void; //non returning function => void
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/current-user");
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      //even if api fails... clear the local state
    } finally {
      setUser(null);
    }
  };

  // Called after profile update, update User without re-fetching
  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


// Custom hook
export const useAuth = () =>{
  const context = useContext(AuthContext)

  if(!context){
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
