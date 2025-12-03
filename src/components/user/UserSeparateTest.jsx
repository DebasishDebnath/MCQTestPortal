import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import StatusIndicator from "../common/StatusIndicator.jsx";

function UserSeparateTest({ testData }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${formattedDate} • ${formattedTime}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(testData.startDate);
      const diffMs = start - now; // milliseconds

      if (diffMs > 0) {
        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes > 30) {
          setStatus("future"); // Test is NOT in 30 min window
          setTimeLeft(null);
        } else {
          setStatus("upcoming"); // Test starts in < 30 minutes
          setTimeLeft(diffMinutes);
        }
      } else {
        // Test has started
        const ongoingMinutes = Math.floor(Math.abs(diffMs) / 60000);

        if (ongoingMinutes <= 30) {
          setStatus("ongoing"); // For first 30 mins after start
          setTimeLeft(30 - ongoingMinutes);
        } else {
          setStatus("closed"); // More than 30 min after start
          setTimeLeft(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testData.startDate]);

  // Fallbacks for missing fields
  const questionsCount = testData.questions ? testData.questions.length : (testData.totalQuestions || 0);
  const marks = testData.totalMarks || 0;
  const duration = testData.durationMinutes ? (testData.durationMinutes / 60) : 0;
  const usersCount = testData.users ? testData.users.length : (testData.totalUsers || 0);

  // Use backend status for badge
  const backStatus = testData.status; // "live", "draft", "closed"

  let statusClass = "";
  if (backStatus === "live") {
    statusClass = "bg-green-400";
  } else if (backStatus === "draft") {
    statusClass = "bg-indigo-400";
  } else if (backStatus === "closed") {
    statusClass = "bg-gray-400";
  }

  return (
    <div className="border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-2 w-full">
      <div className="flex gap-5 relative items-center">
        <div className="bg-indigo-100 text-indigo-400 rounded-sm px-2 flex items-center text-xs">
          {formatDateTime(testData.startDate)}
        </div>

        {/* Status badge with indicator and label */}
        <div className="flex items-center gap-2">
          
          <StatusIndicator status={backStatus} />
        </div>

        {/* Edit button only for upcoming (draft) */}
        {backStatus === "draft" && (
          <div className="flex items-end justify-end absolute right-0 top-0 cursor-pointer">
            <button className="text-indigo-400 cursor-pointer">
              <TbEdit size={25} />
            </button>
          </div>
        )}
      </div>

      <div className="text-lg font-medium flex flex-col gap-4">
        {testData.title}
      </div>

      <div className="flex flex-col text-gray-500 text-sm">
        <div className="flex gap-3 items-center">
          <div className="flex items-center">
            {questionsCount} Questions
          </div>
          <GoDotFill size={10} />
          <div className="flex items-center">
            {marks} Marks
          </div>
          <GoDotFill size={10} />
          <div className="flex items-center gap-1">
            <IoMdTime className="text-gray-800" size={18}/> {duration} hour
          </div>
          <GoDotFill size={10} />
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-800" size={14}/> {usersCount}
          </div>
        </div>

        <div className="flex gap-3 pt-1">Department: </div>
        <div className="flex gap-3 pt-1">Semester: </div>
      </div>

      <div className="flex border-indigo-400 border text-indigo-400 w-fit items-center justify-center rounded-md py-1 px-4 shadow-md shadow-indigo-200 mt-2 cursor-pointer">
        Student Performance
      </div>
    </div>
  );
}

export default UserSeparateTest;
