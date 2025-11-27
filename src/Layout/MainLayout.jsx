import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/user/Header";

function MainLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
