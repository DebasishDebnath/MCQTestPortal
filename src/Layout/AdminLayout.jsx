import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/user/Header";

function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
