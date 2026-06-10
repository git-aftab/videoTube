import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "@/services/axios";
import { User } from "@/types";

interface AuthContextType {
  user: User | null; //logged-in user, or null if guest
  isLoading: boolean;
  isAuhenticated: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => Promise<void>;
  updatedUser: (userData: Partial<User>) => void;
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
};
