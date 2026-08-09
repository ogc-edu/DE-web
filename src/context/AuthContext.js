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
            id: userData.userId,
            name: userData.username,
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

  const login = async (credentials, remember = false) => {
    const response = await authService.login(credentials);
    const { token } = response.data;
    // Store the token BEFORE fetching the profile so the axios interceptor attaches it
    if (remember) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    // Backend login returns only the token; fetch the full profile for user state
    const profileResponse = await authService.getProfile();
    const { user } = profileResponse.data;
    const normalizedUser = { ...user, id: user._id, name: user.name ?? user.username };
    setUser(normalizedUser);
    return { token, user: normalizedUser };
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
