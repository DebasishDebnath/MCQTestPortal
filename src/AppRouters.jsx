import React from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import UserLayout from "./Layout/UserLayout";
import AdminLayout from "./Layout/AdminLayout";
import LoginPage from "./Page/user/LoginPage";
import RegisterPage from "./Page/user/RegisterPage";
import AdminLogin from "./Page/admin/AdminLogin";
import AdminRegister from "./Page/admin/AdminRegister";
import Instruction from "./Page/user/Instruction";
import SystemCompatibility from "./Page/user/SystemCompatibility";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="instruction" element={<Instruction />} />
        <Route path="system-compatibility" element={<SystemCompatibility />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
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
