import React from "react";
import { IoWarningOutline } from "react-icons/io5";
import { LuClock } from "react-icons/lu";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function FinalSubmission({ onClose }) {
  // Sample data - you can replace this with props or state
  const totalQuestions = 100;
  const attempted = 70;
  const markedForRevisit = 10;
  const unattempted = 12;

  // Chart data
  const chartData = {
    labels: ['Attempted', 'Marked for Revisit', 'Unattempted'],
    datasets: [
      {
        data: [attempted, markedForRevisit, unattempted],
        backgroundColor: ['#1e3a8a', '#fbbf24', '#d1d5db'],
        borderWidth: 0,
        cutout: '30%',
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
    <div className="w-1/2 absolute top-0 right-0 min-h-screen z-50 flex flex-col poppins ">
      {/* Header */}
      <div className="flex flex-col w-full bg-white">
        <div className="p-6 flex justify-between items-center w-full">
          <div className="text-gray-800 text-lg font-semibold flex gap-2 items-center">
            <IoWarningOutline size={24} className="text-red-600" />
            <h2>Finish Test</h2>
          </div>
          <div className="text-sm flex gap-2 text-blue-theme items-center">
            <LuClock size={16}/>
            <h2>Remaining Time : 00:53:23</h2>
          </div>
        </div>
        <div className="flex p-10 w-full">
          {/* Donut Chart */}
          <div className="w-1/2 justify-center items-center flex">
            <div className="w-[200px]"><Doughnut data={chartData} options={chartOptions} /></div>
          </div>
          <div className="w-1/2 flex flex-col">
            <h3 className="text-gray-800 font-semibold mb-6">Your Test Summary</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-gray-800">{totalQuestions}</span>
                <span className="text-gray-600">Total Questions</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-900"></span>
                <span className="text-gray-700">Attempted: {attempted}/{totalQuestions}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="text-gray-700">Marked for Revisit: {markedForRevisit}/{totalQuestions}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                <span className="text-gray-700">Unattempted: {unattempted}/{totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-100">

        {/* Section Summary */}
        <div className="">
          <h3 className="text-gray-800 font-semibold mb-4">Section Summary</h3>
          
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-300">
                <th className="text-left p-3 text-sm font-medium text-gray-700">#</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">SECTION NAME</th>
                <th className="text-left p-3 text-sm font-medium text-gray-700">STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr className="">
                <td className="p-3 text-gray-700">1</td>
                <td className="p-3">
                  <div>
                    <div className="font-medium text-blue-theme">Program</div>
                    <div className="text-xs text-gray-500">Untested Section</div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-theme h-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap">70/100</span>
                    <span className="text-xs text-gray-500">Total 1 Questions</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-white border-t-2 border-gray-300 py-4 px-8 flex gap-4 items-center">
        <button className="cursor-pointer py-2 px-8 bg-red-700 hover:bg-red-800 text-white rounded-full text-sm font-medium transition-colors">
          Finish test
        </button>
        <button onClick={onClose} className="cursor-pointer py-2 px-8 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-full text-sm font-medium transition-colors">
          No, Back to Test
        </button>
      </div>
    </div>
  );
}

export default FinalSubmission;