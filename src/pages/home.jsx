import React, { useContext } from "react";
import { logout } from "../api";
import { useNavigate } from "react-router";
import { Context } from "../context";

export default function Home() {
  const navigate = useNavigate();
  const csrfToken = useContext(Context);

  const handleLogout = async () => {
    const res = await logout(csrfToken);
    if (res.success) navigate("/login");
  };
  return (
    <div>
      Home
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}
