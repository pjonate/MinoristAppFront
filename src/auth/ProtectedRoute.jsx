import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useAuth();

  if (isAuth == false){
    return <Navigate to="/" replace />
  }

  return children;
}

export default ProtectedRoute;

