import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (token) {
          // Validate the token with the server
          const response = await fetch("/api/auth/validate", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem("authToken");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, simulate a logged-in user
    // In a real app, you'd check the token with the server as above
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  const logout = () => {
    // Remove token and user data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
