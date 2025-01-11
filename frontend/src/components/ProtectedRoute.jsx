import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, authRole }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!authRole.includes(userRole)) {
        return <Navigate to="/homepage" />;
    }

    return children;
};

export default ProtectedRoute;