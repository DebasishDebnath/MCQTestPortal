import React from "react";
import AppRouters from "./AppRouters";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster */}
      <AppRouters />
    </>
  );
}

export default App;
