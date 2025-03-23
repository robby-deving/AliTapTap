// AuthContext.tsx
import { createContext, useState, useEffect, ReactNode, useContext } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  isAdmin: boolean;
  profile_picture: string | null;
  address: any[];
  payment_method: any[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User & { token: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context with a default value that matches the shape
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

// Custom hook for easier context consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  useEffect(() => {
    // Update authentication status whenever user changes
    setIsAuthenticated(!!user);
  }, [user]);

  const login = (userData: User & { token: string }) => {
    try {
      const { token, ...userInfo } = userData;
      
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userInfo));
      
      // Store token in localStorage or cookie
      localStorage.setItem("authToken", token);
      
      // Set cookie without HttpOnly flag (as it can't be set from client-side)
      document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;
      
      setUser(userInfo);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}