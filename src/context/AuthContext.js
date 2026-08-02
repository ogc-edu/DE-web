import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      if(!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authService.verifyToken(); //verify token with backend
        
        if(response.data && response.status === 200) {
          const { userData } = response.data;
          setUser({
            ...userData, 
            id: userData._id,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
        setLoading(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { user } = response.data;
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
