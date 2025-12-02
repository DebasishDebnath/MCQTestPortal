import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// User Pages
import LoginPage from "./Page/admin/AdminLogin"; 
import RegisterPage from "./Page/user/RegisterPage";
import UserLayout from "./Layout/UserLayout";

// Admin Pages
import AdminLayout from "./Layout/AdminLayout";
import AdminLogin from "./Page/admin/AdminLogin";
import AdminRegister from "./Page/admin/AdminRegister";
import AdminDashboard from "./Page/admin/AdminDashboard";

// User Components
import Instruction from "./Page/user/Instruction";
import SystemCompatibility from "./Page/user/SystemCompatibility";
import TestQuestion from "./Page/user/TestQuestion";
import SubmissionSuccess from "./Page/user/SubmissionSuccess";

// Admin Components
import AllTest from "./Page/admin/AllTest";
import TestDetails from "./Page/admin/TestDetails";

// Error Component
import RouteErrorPopup from "./components/error/RouteErrorPopup";

// ---------------- AUTH HELPERS ----------------

const isLoggedIn = () => !!localStorage.getItem("userToken");
const getUserRole = () => localStorage.getItem("userRole");

// User Protected Route
function ProtectedRoute() {
  const role = getUserRole();
  if (role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

// Default landing route guard
function UserRouteGuard({ children }) {
  const role = getUserRole();
  if (role === "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

// Prevent logged-in admin from re-accessing login page
function AdminAuthGuard({ children }) {
  return isLoggedIn() ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    children
  );
}

// Protect admin routes
function SuperAdminGuard({ children }) {
  const token = isLoggedIn();
  const role = getUserRole();
  if (!token || role !== "superadmin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

// ---------------- ROUTER SETUP ----------------

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* USER ROUTES */}
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

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="system-compatibility" element={<SystemCompatibility />} />
          <Route path="instruction" element={<Instruction />} />
          <Route path="test/:testid" element={<TestQuestion />} />
        </Route>

        <Route path="success" element={<SubmissionSuccess />} />
      </Route>

      {/* ADMIN AUTH ROUTES */}
      <Route
        path="/admin/login"
        element={
          <AdminAuthGuard>
            <AdminLogin />
          </AdminAuthGuard>
        }
      />
      <Route
        path="/admin/register"
        element={
          <AdminAuthGuard>
            <AdminRegister />
          </AdminAuthGuard>
        }
      />

      {/* ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin"
        element={
          <SuperAdminGuard>
            <AdminLayout />
          </SuperAdminGuard>
        }
        errorElement={<RouteErrorPopup />}
      >
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
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="test-details" element={<TestDetails />} />
        <Route path="all-test" element={<AllTest />} />
      </Route>
    </>
  )
);

function AppRouters() {
  return <RouterProvider router={router} />;
}

export default AppRouters;
