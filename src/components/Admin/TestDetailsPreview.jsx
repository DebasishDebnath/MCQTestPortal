import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useHttp } from "../../hooks/useHttp";

function TestDetailsPreview({ previewData, onBack, onUpdateQuestions, onUpdateStudentsFile }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { post, loading: isSubmitting, error } = useHttp();
  const navigate = useNavigate();

  if (!previewData) {
    return (
      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-xl p-10 flex items-center justify-center">
        <p className="text-gray-500">Loading preview data...</p>
      </div>
    );
  }

  const { details, questions, files } = previewData;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Helper to check if an option is a correct answer
  const isCorrect = (optionIndex) => {
    const correctAnswers = String(currentQuestion.correct_answers)
      .split(",")
      .map((item) => item.trim());
    const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D
    return correctAnswers.includes(optionLetter);
  };

  const handleQuestionsFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      onUpdateQuestions(json, file.name);
      setCurrentQuestionIndex(0); // Reset to the first question
    };
    reader.readAsArrayBuffer(file);
  };

  const handleStudentsFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpdateStudentsFile(file.name);
  };

  const handleCreateTest = async () => {
    if (!previewData) {
      alert("No test data found to create.");
      return;
    }

    const { details, questions } = previewData;

    const payload = {
      title: details.testName,
      semester: details.semester,
      department: details.department,
      totalMarks: details.totalMarks,
      durationMinutes: details.duration,
      testMode: details.testType,
      startDate: details.startDateTime, // Already ISO string from form component
      endDate: details.endDateTime,     // Already ISO string from form component
      supervisorEmail:
        details.testType === "Offline" ? details.examSupervisiorEmail : undefined,
      questions: questions,
    };

    const token = localStorage.getItem("userToken");

    try {
      await post("/api/exam/create", payload, {
        Authorization: `Bearer ${token}`,
      });

      localStorage.removeItem("testPreviewData");
      navigate("/admin/success", { state: { ...details } });
    } catch (err) {
      console.error("Failed to create exam:", err);
      alert(`Error: ${error?.message || "Could not create the test."}`);
    }
  };

  return (
    <div className="bg-white w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col h-fit gap-10 poppins">
      {/* Top Details Section */}
      <div className="bg-indigo-50 w-full rounded-2xl shadow-md p-6 flex flex-row justify-between items-center h-fit gap-6">
        <div className="flex flex-col gap-2 w-2/3">
          <div className="bg-blue-100 text-blue-theme rounded-sm px-2 py-1 flex items-center text-xs w-fit">
            {dayjs(details.startDateTime).format("MMM DD • hh:mm A")}
          </div>

          <div className="text-lg font-medium flex flex-col ">
            {details.testName}
          </div>

          <div className="flex flex-col text-gray-500 text-sm h-full">
            <div className="flex gap-3 items-center">
              <div className="flex items-center">
                {questions.length} Questions
              </div>
              <GoDotFill size={10} />
              <div className="flex items-center">
                {details.totalMarks} Marks
              </div>
              <GoDotFill size={10} />
              <div className="flex items-center gap-1">
                <IoMdTime className="text-gray-800" size={18} />{" "}
                {details.duration} Minutes
              </div>
              <GoDotFill size={10} />
              <div className="flex items-center gap-1">
                <FaUser className="text-gray-800" size={14} />{" "}
                {files.studentsFileName ? "Students Uploaded" : "No Students"}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              Department: {details.department}
            </div>
            <div className="flex gap-3 pt-1">Semester: {details.semester}</div>
            <div className="flex justify-start gap-4 mt-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-white hover:bg-red-500 border border-red-500 text-red-500 hover:text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-30 cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleCreateTest}
              className="bg-blue-theme text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-30 disabled:bg-gray-400 cursor-pointer"
              disabled={isSubmitting}
            > Create
            </button>
          </div>
          </div>
        </div>
        <div className="h-40 w-[2px] bg-gray-300"></div>
        <div className="w-1/3 flex flex-col gap-2">
          <div className="text-lg font-medium flex flex-col ">Questions</div>
          <label className="border-2 border-gray-200 rounded-xl p-3 bg-green-100 flex items-center gap-2 cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleQuestionsFileChange}
            />
            <img src="/excel.png" alt="excel_logo" className="w-5 h-5" />
            <span
              className="text-sm font-medium text-gray-700 truncate"
              title={files.questionsFileName}
            >
              {files.questionsFileName}
            </span>
            <Upload size={20} className="text-blue-theme ml-auto" />
          </label>
          <div className="text-lg font-medium flex flex-col ">
            Student Details
          </div>
          <label
            className={`border-2 border-gray-200 rounded-xl p-3 flex items-center gap-2 ${
              files.studentsFileName ? "bg-green-100" : "bg-gray-100"
            } cursor-pointer`}
          >
            <input
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleStudentsFileChange}
            />
            <img src="/excel.png" alt="excel_logo" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700 truncate">
              {files.studentsFileName || "Not Uploaded"}
            </span>
            <Upload size={20} className="text-blue-theme ml-auto" />
          </label>
        </div>
      </div>

      {/* Questions and Answers Section */}
      {currentQuestion && (
        <div className="flex flex-col gap-4">
          <h2 className="text-blue-theme font-semibold text-[24px]">
            Questions and Answers
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex border-2 border-gray-200 p-6 gap-4 rounded-2xl">
              <div className="flex w-8 h-8 rounded-full justify-center items-center bg-indigo-100 font-semibold text-blue-theme flex-shrink-0 mt-1">
                {currentQuestionIndex + 1}
              </div>
              <div className="flex flex-col gap-4 w-full mt-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {currentQuestion.question_text}
                  </h3>
                  <div className="flex gap-4 items-center text-blue-theme text-sm font-medium">
                    <div className="flex px-6 py-1 rounded-full justify-center items-center bg-indigo-100 flex-shrink-0 mt-1">
                      Marks: {currentQuestion.marks} | Negative Marks: {currentQuestion.negative_marks}
                    </div>
                  </div>
                </div>
                <ol className="flex flex-col gap-2 text-gray-700 text-sm">
                  {[...Array(4)].map((_, i) => {
                    const optionText = currentQuestion[`option_${i + 1}`];
                    if (!optionText) return null;
                    const correct = isCorrect(i);
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          correct
                            ? "border-green-200 bg-green-100 text-green-800 font-medium"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <span className="font-semibold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{optionText}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
            {/* Pagination */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="flex h-8 w-12 rounded-full justify-center items-center bg-indigo-100 font-medium text-blue-theme flex-shrink-0 mt-1 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex h-8 px-4 rounded-full justify-center items-center bg-blue-theme font-medium text-sm text-white flex-shrink-0 mt-1 gap-2">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex h-8 w-12 rounded-full justify-center items-center bg-indigo-100 font-medium text-blue-theme flex-shrink-0 mt-1 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestDetailsPreview;
