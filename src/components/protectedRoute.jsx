import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Navbar from "./navbar";

export default function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}
