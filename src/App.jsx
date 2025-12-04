import React from "react";
import AppRouters from "./AppRouters";
import { Toaster } from "react-hot-toast";
import { QuestionAttemptProvider } from "./context/QuestionAttemptContext";

function App() {
  return (
    <QuestionAttemptProvider>
      <Toaster position="top-center" reverseOrder={false} /> {/* Add Toaster */}
      <AppRouters />
    </QuestionAttemptProvider>
  );
}

export default App;
