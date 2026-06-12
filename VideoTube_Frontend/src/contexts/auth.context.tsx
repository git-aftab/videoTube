import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/axios";
import type { ReactNode } from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null; //logged-in user, or null if guest
  isLoading: boolean;
  isAuhenticated: boolean;
  login: (accessToken: string, userData: User) => void; //non returning function => void
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //   On load checks if user is already logge(Token is LocalStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        //fetch current user profile from Backend
        const response = await api.get("/users/current-user");
        setUser(response.data.data);
      } catch (error) {
        // token is invalid or expired - clean up
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (accessToken: string, userData: User) => {
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      //even if api fails... clear the local state
    } finally {
      localStorage.removeItem("accessToken");
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
    isAuhenticated: !!user,
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