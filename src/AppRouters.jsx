import React from "react";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import RootLayout from "./Layout/MainLayout";
import LoginPage from "./Page/LoginPage";
import RegisterPage from "./Page/RegisterPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>
  )
);

function AppRouters() {
  return <RouterProvider router={router} />;
}

export default AppRouters;
