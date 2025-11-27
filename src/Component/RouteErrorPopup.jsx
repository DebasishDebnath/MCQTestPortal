import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import ErrorPopup from "./ErrorPopup";

export default function RouteErrorPopup() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Extract error message
  const message =
    error?.statusText ||
    error?.message ||
    "An unexpected error occurred. Please try again.";

  return (
    <ErrorPopup
      message={message}
      onClose={() => navigate("/")}
    />
  );
}