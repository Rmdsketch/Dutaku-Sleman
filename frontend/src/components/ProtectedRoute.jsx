import React from "react";
import { Navigate } from "react-router-dom";

// Decode JWT untuk mendapatkan payload, khususnya exp (expiry time)
const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Fungsi untuk mendapatkan token yang valid
const getValidToken = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload) return null;

  // exp dalam detik, Date.now() dalam milidetik
  const isExpired = payload.exp * 1000 < Date.now();
  if (isExpired) {
    // Hapus token yang sudah kedaluwarsa dari semua storage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userRole");
    return null;
  }

  return token;
};

const ProtectedRoute = ({ children, authRole }) => {
  const token = getValidToken();
  const userRole =
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (authRole && !authRole.includes(userRole)) {
    return <Navigate to="/homepage" replace />;
  }

  return children;
};

export default ProtectedRoute;