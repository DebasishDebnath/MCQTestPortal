import React from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate, Outlet } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import LoginPage from "./Page/user/LoginPage";
import RegisterPage from "./Page/user/RegisterPage";
import AdminLogin from "./Page/admin/AdminLogin";
import AdminRegister from "./Page/admin/AdminRegister";
import Instruction from "./Page/user/Instruction";
import SystemCompatibility from "./Page/user/SystemCompatibility";
import RouteErrorPopup from "./Component/RouteErrorPopup";

// Simple auth check (replace with your logic)
const isLoggedIn = () => !!localStorage.getItem("userToken");

// Protected Route component
function ProtectedRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

import SubmissionSuccess from "./Page/user/SubmissionSuccess";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<UserLayout />} errorElement={<RouteErrorPopup />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="instruction" element={<Instruction />} />
          <Route path="system-compatibility" element={<SystemCompatibility />} />
        </Route>
        <Route path="success" element={<SubmissionSuccess />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />} errorElement={<RouteErrorPopup />}>
        <Route index element={<div>Admin Dashboard</div>} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="register" element={<AdminRegister />} />
      </Route>
    </>
  )
);

function AppRouters() {
  return <RouterProvider router={router} />;
}

export default AppRouters;
