import React, { useEffect, useState } from "react";
import { Download, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useHttp } from "../../hooks/useHttp";

ChartJS.register(ArcElement, Tooltip, Legend);

function StudentPerformance({ testId, title }) {
  const token = localStorage.getItem("userToken");
  const { get } = useHttp();

  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (testId) {
      get(
        `/api/exam/getExamScoreDetails/${testId}`,
        { Authorization: `Bearer ${token}` }
      ).then((data) => {
        if (data?.success && data.data?.attemptDetails) {
          // Map attemptDetails to students array for table
          setStudents(
            data.data.attemptDetails.map((attempt, idx) => ({
              name: attempt.studentId.name,
              rollNumber: attempt.studentId.enrollmentNumber,
              marks: `${attempt.score}/${attempt.exam.totalMarks}`,
              timeTaken: attempt.totalTimeTaken,
              profileImage: attempt.studentId.profileImage,
              email: attempt.studentId.email,
            }))
          );
          // Leaderboard: sort by score descending, then map
          const sorted = [...data.data.attemptDetails].sort(
            (a, b) => b.score - a.score
          );
          setLeaderboard(
            sorted.map((attempt, idx) => ({
              name: attempt.studentId.name,
              score: `${attempt.score}/${attempt.exam.totalMarks}`,
              rank: idx + 1,
              profileImage: attempt.studentId.profileImage,
            }))
          );
        }
      });
    }
  }, [testId, get, token]);

  const chartData = {
    labels: [">90", "75-90", "50-75", "<50"],
    datasets: [
      {
        data: [12, 35, 20, 18],
        backgroundColor: ["#1e3a8a", "#60a5fa", "#93c5fd", "#dbeafe"],
        borderWidth: 0,
        cutout: "30%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="bg-indigo-100 w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col gap-6">
      {/* Student Results Table */}
      <div className="flex flex-col w-full bg-white rounded-2xl shadow-md p-10 gap-2 w-full">
        <div className="text-blue-theme font-semibold text-2xl">
           {title}
        </div>
        <div className="h-[2px] bg-gray-200 w-full mb-4"></div>

        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-blue-50 text-gray-500 text-md">
                <th className="p-4 font-medium text-left">Student Name</th>
                <th className="p-4 font-medium text-center">Roll Number</th>
                <th className="p-4 font-medium text-center">Marks Obtained</th>
                <th className="p-4 font-medium text-center">Time taken</th>
                <th className="p-4 font-medium text-center">Download Report</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 text-gray-700"
                >
                  <td className="p-4 flex items-center gap-2">
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{student.name}</span>
                  </td>
                  <td className="p-4 text-center">{student.rollNumber}</td>
                  <td className="p-4 text-center">{student.marks}</td>
                  <td className="p-4 text-center">{student.timeTaken}</td>
                  <td className="p-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-4 text-sm">
          <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer">
            <ChevronLeft size={16} />
            Previous
          </button>
          <button className="w-8 h-8 rounded-full bg-blue-theme text-white flex items-center justify-center">
            1
          </button>
          <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1 cursor-pointer">
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Performance Analytics and Leaderboard */}
      <div className="flex flex-row gap-6">
        {/* Performance Analytics */}
        <div className="flex flex-col w-2/3 bg-white rounded-2xl shadow-md p-10 gap-2">
          <div className="text-blue-theme font-semibold text-2xl">
            Performance Analytics
          </div>
          <div className="h-[2px] bg-gray-200 w-full mb-4"></div>

          <div className="flex items-end gap-10 justify-between">
            {/* Donut Chart */}
            <div className="w-60 h-60">
              <Doughnut data={chartData} options={chartOptions} />
            </div>

            {/* Legend */}
            <div className="flex w-1/2">
              <table className="w-full text-gray-700 text-md">
                <thead>
                  <tr className="">
                    <th className="pb-3 font-semibold text-left">Score</th>
                    <th className="pb-3 font-semibold text-center">
                      No. of Students
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-blue-900"></div>
                        <span>&gt;90</span>
                      </div>
                    </td>
                    <td className="text-center">12</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-blue-400"></div>
                        <span>75-90</span>
                      </div>
                    </td>
                    <td className="text-center">35</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-blue-300"></div>
                        <span>50-75</span>
                      </div>
                    </td>
                    <td className="text-center">20</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-blue-100"></div>
                        <span>&lt;50</span>
                      </div>
                    </td>
                    <td className="text-center">18</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className=" flex flex-col w-1/3 bg-white rounded-2xl shadow-md p-10 gap-2">
          <div className="text-blue-theme font-semibold text-2xl">
            Leaderboard
          </div>
          <div className="h-[2px] bg-gray-200 w-full mb-4"></div>

          <div className="flex flex-col gap-1">
            {leaderboard.map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="relative">
                  <img src="/medal.png" alt="medal img" />
                  <span className="absolute bottom-0 right-2/5 text-xs font-medium text-blue-900">
                    {student.rank}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{student.name}</p>
                </div>
                <div className="">
                  <span className="font-semibold text-gray-600">
                    {student.score.split("/")[0]}
                  </span>
                  <span className="text-gray-500">
                    /{student.score.split("/")[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPerformance;
