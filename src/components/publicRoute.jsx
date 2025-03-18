import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function PublicRoute() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
}
