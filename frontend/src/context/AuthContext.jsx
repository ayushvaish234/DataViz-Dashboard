import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "Member");

  const saveToken = (t, r) => {
    setToken(t); setRole(r);
    localStorage.setItem("token", t);
    localStorage.setItem("role", r);
  };
  const logout = () => {
    setToken(""); setRole("Member");
    localStorage.removeItem("token"); localStorage.removeItem("role");
  };
  return <AuthContext.Provider value={{ token, role, saveToken, logout }}>{children}</AuthContext.Provider>;
};
