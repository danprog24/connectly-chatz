import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

const PublicRoute: React.FC = () => {
  const { token } = useAuthStore();
  return !token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;