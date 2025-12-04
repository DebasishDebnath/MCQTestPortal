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
import LoginPage from "./Page/user/LoginPage"; 
import RegisterPage from "./Page/user/RegisterPage";
import UserLayout from "./Layout/UserLayout";

// Admin Pages
import AdminLayout from "./Layout/AdminLayout";
import AdminAuthLayout from "./Layout/AdminAuthLayout";
import AdminLogin from "./Page/admin/AdminLogin";
import AdminRegister from "./Page/admin/AdminRegister";
import Dashboard from "./Page/admin/Dashboard";

// User Components
import Instruction from "./Page/user/Instruction";
import SystemCompatibility from "./Page/user/SystemCompatibility";
import TestQuestion from "./Page/user/TestQuestion";
import SubmissionSuccess from "./Page/user/SubmissionSuccess";

// Admin Components
import AllTest from "./Page/admin/AllTest";
import CreateTest from "./Page/admin/CreateTest";

// Error Component
import RouteErrorPopup from "./components/error/RouteErrorPopup";
import UserDashboard from "./Page/user/UserDashboard";
import UserResults from "./Page/user/UserCompletedTests";
import ScheduleSuccess from "./Page/admin/ScheduleSuccess";

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

        {/* ✅ Add this route OUTSIDE protected routes to handle backend links */}
        <Route path="test/:testid" element={<LoginPage />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="completed-tests" element={<UserResults />} />
          
          <Route path="system-compatibility/:testid" element={<SystemCompatibility />} />
          <Route path="instruction/:testid" element={<Instruction />} />
          {/* ✅ Keep this protected route for actual test taking */}
          <Route path="test-page/:testid" element={<TestQuestion />} />
        </Route>

        <Route path="success" element={<SubmissionSuccess />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={<AdminAuthLayout />}
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
        <Route element={<SuperAdminGuard><AdminLayout /></SuperAdminGuard>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-test" element={<CreateTest />} />
          <Route path="all-test" element={<AllTest />} />
        </Route>
        <Route path="success" element={<ScheduleSuccess />} />
      </Route>
    </>
  )
);

function AppRouters() {
  return <RouterProvider router={router} />;
}

export default AppRouters;
