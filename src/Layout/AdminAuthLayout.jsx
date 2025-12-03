import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function AdminAuthLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <Outlet />
    </div>
  );
}

export default AdminAuthLayout;