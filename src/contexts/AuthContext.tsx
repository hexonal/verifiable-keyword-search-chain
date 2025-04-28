
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { api } from "../services/api";
import { toast } from "sonner";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check local storage for saved auth on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedToken && savedUserId) {
      setIsLoggedIn(true);
      setToken(savedToken);
      setUserId(savedUserId);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login({ username, password });
      
      if (response.code === 200 && response.data) {
        setIsLoggedIn(true);
        setToken(response.data.token);
        setUserId(response.data.userId);
        
        // Save to local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        
        toast.success("登录成功");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    toast.success("已退出登录");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
