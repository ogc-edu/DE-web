import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { //useEffect cannot run async await, define and implement a function inside useEffect
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

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
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
