import React from "react";
import { getCookie } from "./utils/cookies";
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const connectSid = getCookie("connect.sid");
  return connectSid ? <Outlet /> : <Navigate to="/login" />;
}
