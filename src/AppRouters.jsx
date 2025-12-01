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
import TestQuestion from "./Page/user/TestQuestion";
import RouteErrorPopup from "./components/error/RouteErrorPopup";

// Simple auth check (replace with your logic)
const isLoggedIn = () => !!localStorage.getItem("userToken");

// Get user role from localStorage/sessionStorage (adjust as needed)
const getUserRole = () => localStorage.getItem("userRole"); // e.g., "superadmin", "user"

// Protected Route component for user routes
function ProtectedRoute() {
  const role = getUserRole();
  if (role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

// Top-level route guard for "/"
function UserRouteGuard({ children }) {
  const role = getUserRole();
  if (role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function AdminAuthGuard({ children }) {
  const isAuth = isLoggedIn();
  if (isAuth) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function SuperAdminGuard({ children }) {
  const token = isLoggedIn();
  const role = getUserRole();
  if (!token || role !== "superadmin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

import SubmissionSuccess from "./Page/user/SubmissionSuccess";
import AdminDashboard from "./Page/admin/AdminDashboard";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <UserRouteGuard>
            <UserLayout />
          </UserRouteGuard>
        }
        errorElement={<RouteErrorPopup />}
      >
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="instruction" element={<Instruction />} />
          <Route path="system-compatibility" element={<SystemCompatibility />} />
          <Route path="test/:testid" element={<TestQuestion />} />
        </Route>
        <Route path="success" element={<SubmissionSuccess />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />} errorElement={<RouteErrorPopup />}>
        {/* <Route index element={<div>Admin Dashboard</div>} /> */}
        <Route
          path="login"
          element={
            <AdminAuthGuard>
              <AdminLogin />
            </AdminAuthGuard>
          }
        />
        <Route
          path="register"
          element={
            <AdminAuthGuard>
              <AdminRegister />
            </AdminAuthGuard>
          }
        />
        <Route
          path="dashboard"
          element={
            <SuperAdminGuard>
              <AdminDashboard />
            </SuperAdminGuard>
          }
        />
      </Route>
    </>
  )
);

function AppRouters() {
  return <RouterProvider router={router} />;
}

export default AppRouters;
