import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar.jsx";

function AdminLayout() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* The Outlet will render the matched child route component (e.g., AdminDashboard, TestDetails) */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
