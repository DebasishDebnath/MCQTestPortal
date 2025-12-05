import React, { useState, useEffect } from "react";
import TestDetailComponent from "../../components/Admin/TestDetailComponent";
import TestDetailsPreview from "../../components/Admin/TestDetailsPreview";
export default function CreateTest() {
  const [testPreviewData, setTestPreviewData] = useState(null);

  const handleProceedToPreview = (data) => {
    setTestPreviewData(data);
  };

  const handleBackToForm = () => {
    setTestPreviewData(null); // Or pass the data back to the form if you want to edit
  };

  const handleUpdateQuestions = (newQuestions, newFileName) => {
    setTestPreviewData((prevData) => ({
      ...prevData,
      questions: newQuestions,
      files: {
        ...prevData.files,
        questionsFileName: newFileName,
      },
    }));
  };

  const handleUpdateStudentsFile = (newFileName) => {
    setTestPreviewData((prevData) => ({
      ...prevData,
      files: {
        ...prevData.files,
        studentsFileName: newFileName,
      },
    }));
  };
  return (
    <div
      className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center xl:p-20 p-10 bg-blend-overlay poppins"
      style={{ backgroundImage: "url(/regbg.png)" }}
    >
      {testPreviewData ? (
        <TestDetailsPreview
          previewData={testPreviewData}
          onBack={() => setTestPreviewData(null)}
          onUpdateQuestions={handleUpdateQuestions}
          onUpdateStudentsFile={handleUpdateStudentsFile}
        />
      ) : (
        <TestDetailComponent
          initialData={testPreviewData}
          onProceed={handleProceedToPreview}
        />
      )}
    </div>
  );
}
