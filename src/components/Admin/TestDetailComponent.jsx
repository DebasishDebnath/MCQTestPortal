import React, { useState } from "react";
import { ChevronDown, ArrowRight, Upload } from "lucide-react";

function TestDetailComponent() {
  const [formData, setFormData] = useState({
    department: "Computer Science and Technology",
    semester: "5th Semester",
    subjectName: "Machine Learning",
    subjectCode: "PCCS572",
    testCategory: "Midterm Examination",
    testType: "Subjective",
    numberOfQuestions: "60",
    dateTime: "10 Nov , 9:00 AM",
  });

  const [questionsFile, setQuestionsFile] = useState(null);
  const [studentsFile, setStudentsFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      details: formData,
      questionsFile: questionsFile,
      studentsFile: studentsFile,
    });
  };

  const handleQuestionsFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionsFile(file);
    }
  };

  const handleStudentsFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentsFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleQuestionsDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setQuestionsFile(file);
    }
  };

  const handleStudentsDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setStudentsFile(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-7xl bg-white rounded-3xl shadow-xl p-10 flex flex-col gap-10"
    >
      <div className="flex gap-12">
        <div className="w-1/2">
          <h2 className="text-2xl font-semibold text-blue-theme mb-6">
            Test Details
          </h2>

          <div className="flex flex-col gap-4">
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Department *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  <option>Computer Science and Technology</option>
                  <option>Information Technology</option>
                  <option>Electronics Engineering</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Semester *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                >
                  <option>5th Semester</option>
                  <option>6th Semester</option>
                  <option>7th Semester</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Subject Name *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.subjectName}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectName: e.target.value })
                  }
                >
                  <option>Machine Learning</option>
                  <option>Data Structures</option>
                  <option>Algorithms</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Subject Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Subject Code *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.subjectCode}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectCode: e.target.value })
                  }
                >
                  <option>PCCS572</option>
                  <option>PCCS573</option>
                  <option>PCCS574</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Test Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Test Category *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.testCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, testCategory: e.target.value })
                  }
                >
                  <option>Midterm Examination</option>
                  <option>Final Examination</option>
                  <option>Quiz</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Test Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Test Type *
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                  value={formData.testType}
                  onChange={(e) =>
                    setFormData({ ...formData, testType: e.target.value })
                  }
                >
                  <option>Subjective</option>
                  <option>Objective</option>
                  <option>Mixed</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Number of Questions *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfQuestions: e.target.value,
                  })
                }
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-2">
                Date & Time *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                value={formData.dateTime}
                onChange={(e) =>
                  setFormData({ ...formData, dateTime: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-10 h-full">
          <div className="flex flex-col gap-3 h-1/2">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-blue-theme">
                Upload Questions
              </h2>
              <p className="text-sm text-gray-400">
                Upload Excel files upto 20 kb
              </p>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-blue-900 rounded-xl bg-blue-50 p-12 text-center h-full flex items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleQuestionsDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <img src="/upload.png" alt="upload" className="w-10" />

                <div>
                  <p className="text-gray-800 mb-1">
                    {questionsFile
                      ? questionsFile.name
                      : "Drag your file(s) to start uploading"}
                  </p>
                  <p className="text-gray-500 text-sm">OR</p>
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleQuestionsFileChange}
                  />
                  <div className="px-6 py-2 border-2 bg-white border-blue-900 rounded-lg text-blue-theme font-medium hover:bg-gray-50 transition-colors">
                    Browse files
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 h-1/2">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-blue-theme">
                Upload Student Details
              </h2>
              <p className="text-sm text-gray-400">
                Upload Excel files upto 20 kb
              </p>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-blue-900 rounded-xl bg-blue-50 p-12 text-center h-full flex items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleStudentsDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <img src="/upload.png" alt="upload" className="w-10" />

                <div>
                  <p className="text-gray-800 mb-1">
                    {studentsFile
                      ? studentsFile.name
                      : "Drag your file(s) to start uploading"}
                  </p>
                  <p className="text-gray-500 text-sm">OR</p>
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleStudentsFileChange}
                  />
                  <div className="px-6 py-2 border-2 bg-white border-blue-900 rounded-lg text-blue-theme font-medium hover:bg-gray-50 transition-colors">
                    Browse files
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Button for the whole form */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-900 hover:bg-blue-950 text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          Submit
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default TestDetailComponent;
