import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload } from "lucide-react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useHttp } from "../../hooks/useHttp";
import * as XLSX from "xlsx";

function TestDetailComponent({ onProceed, initialData }) {
  const { post, loading: isSubmitting, error } = useHttp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    testName: "",
    semester: "",
    department: "",
    totalMarks: "",
    duration: "",
    testType: "Online",
    startDateTime: dayjs(),
    endDateTime: dayjs().add(1, "hour"),
    examSupervisiorEmail: "",
  });

  const [questionsFile, setQuestionsFile] = useState(null);
  const [studentsFile, setStudentsFile] = useState(null);

  React.useEffect(() => {
    // If there's initial data (from going back from preview), pre-fill the form
    if (initialData) {
      const { details } = initialData;
      setFormData({
        ...details,
        // Convert ISO strings back to dayjs objects for the DateTimePicker
        startDateTime: dayjs(details.startDateTime),
        endDateTime: dayjs(details.endDateTime),
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questionsFile) {
      alert("Please upload a questions file.");
      return;
    }

    // 1. Read and parse the Excel file
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // 2. Prepare data for storage
      const testPreviewData = {
        details: {
          ...formData,
          // Convert dayjs objects to strings for JSON serialization
          startDateTime: formData.startDateTime.toISOString(),
          endDateTime: formData.endDateTime.toISOString(),
        },
        questions: json,
        files: {
          questionsFileName: questionsFile?.name,
          questionsFile: questionsFile, 
          studentsFileName: studentsFile?.name,
          studentsFile: studentsFile,   
        },
      };

      // 3. Pass data up to the parent component
      onProceed(testPreviewData);
    };
    reader.readAsArrayBuffer(questionsFile);
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex gap-12">
          <div className="w-1/2">
            <h2 className="text-2xl font-semibold text-blue-theme mb-6">
              Test Details
            </h2>

            <div className="flex flex-col gap-6">
              {/* Department */}
              <TextField
                required
                id="test-name"
                label="Test Name"
                fullWidth
                value={formData.testName}
                onChange={(e) =>
                  setFormData({ ...formData, testName: e.target.value })
                }
              />

              {/* Semester */}
              <TextField
                id="semester"
                label="Semester"
                fullWidth
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              />

              {/* Subject Name */}
              <TextField
                required
                id="department"
                label="Department"
                fullWidth
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              {/* Test Type */}
              <TextField
                id="test-mode"
                select
                required
                fullWidth
                label="Test Mode"
                value={formData.testType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testType: e.target.value,
                    // Clear supervisor email if switching to Online
                    examSupervisiorEmail:
                      e.target.value === "Online"
                        ? ""
                        : formData.examSupervisiorEmail,
                  })
                }
              >
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </TextField>

              {formData.testType === "Offline" && (
                <TextField
                  required
                  id="exam-supervisior-email"
                  label="Exam Supervisior Email"
                  fullWidth
                  value={formData.examSupervisiorEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      examSupervisiorEmail: e.target.value,
                    })
                  }
                />
              )}

              {/* Total Marks */}
              <TextField
                required
                id="total-marks"
                label="Total Marks"
                fullWidth
                value={formData.totalMarks}
                onChange={(e) =>
                  setFormData({ ...formData, totalMarks: e.target.value })
                }
              />

              {/* Duration */}
              <TextField
                required
                id="duration"
                label="Duration"
                fullWidth
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        // Show adornment only when label is shrunk
                        opacity: 0,
                        pointerEvents: "none",
                        [`[data-shrink=true] ~ .${inputBaseClasses.root} &`]: {
                          opacity: 1,
                          pointerEvents: "auto",
                        },
                        // Also show on focus
                        [`.${inputBaseClasses.root}:focus-within &`]: {
                          opacity: 1,
                          pointerEvents: "auto",
                        },
                      }}
                    >
                      minutes
                    </InputAdornment>
                  ),
                }}
              />

              {/* Date & Time */}
              <DateTimePicker
                label="Start Date & Time"
                value={formData.startDateTime}
                onChange={(newValue) =>
                  setFormData({ ...formData, startDateTime: newValue })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                    },
                  },
                }}
              />
              <DateTimePicker
                label="End Date & Time"
                value={formData.endDateTime}
                onChange={(newValue) =>
                  setFormData({ ...formData, endDateTime: newValue })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": { borderRadius: "0.75rem" },
                    },
                  },
                }}
              />
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
                className="border-2 border-dashed border-blue-900 rounded-xl bg-blue-50 p-10 text-center h-full flex items-center justify-center"
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
                className="border-2 border-dashed border-blue-900 rounded-xl bg-blue-50 p-10 text-center h-full flex items-center justify-center"
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
        <div className="flex justify-center gap-10">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-white hover:bg-red-500 border border-red-500 text-red-500 hover:text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-theme text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-50 disabled:bg-gray-400 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </LocalizationProvider>
      {error && <div className="text-center text-red-500 mt-4">Error: {error.message}</div>}
    </form>
  );
}

export default TestDetailComponent;
