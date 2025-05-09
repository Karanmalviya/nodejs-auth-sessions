import React from "react";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
