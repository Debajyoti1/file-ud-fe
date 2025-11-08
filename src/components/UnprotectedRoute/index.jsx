import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function UnprotectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  console.log("uproute",user);
  if (user) {
    // If user is already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
