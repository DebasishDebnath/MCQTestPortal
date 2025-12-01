import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
function SeparateTest({ testData }) {
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

  return (
    <div className="border border-[#E4E4E4] rounded-[15px] px-5 pb-6">
      <div className="flex gap-5 pt-3 pb-3 relative">
        <div className="bg-[#DCE3F6] text-[#5C7CD4] rounded-[3.55px] px-2 text-[12px] flex items-center">
          {formatDateTime(testData.startDate)}
        </div>

        {/* Status badge */}
        {status === "future" && (
          <div className="bg-[#5C7CD4] px-3 text-white text-[12px] flex items-center justify-center rounded-[3.55px] py-1">
            Upcoming
          </div>
        )}

        {status === "upcoming" && (
          <div className="bg-[#5C7CD4] px-3 text-white text-[12px] flex items-center justify-center rounded-[3.55px] py-1">
            Starts in {timeLeft} min
          </div>
        )}

        {status === "ongoing" && (
          <div className="bg-green-500 px-3 text-white text-[12px] flex items-center justify-center rounded-[3.55px] py-1">
            Ongoing • {timeLeft} min left
          </div>
        )}
        <div className="flex items-end justify-end absolute right-0 top-0 cursor-pointer">
          {(status === "future" || status === "upcoming") && (
            <button className="text-blue-500 underline mt-2 cursor-pointer">
              <TbEdit size={25} />
            </button>
          )}
        </div>
      </div>

      <div className="text-[15px] font-medium">{testData.title}</div>

      <div className="flex gap-3 pt-1 text-[#727272]">
        <div className="flex items-center">
          {testData.questions.length} Questions
        </div>
        <div className="flex items-center">
          <GoDotFill /> 60 Marks
        </div>
        <div className="flex items-center gap-2">
          <IoMdTime /> {testData.durationMinutes / 60} hour
        </div>
        <div className="flex items-center gap-2">
          <FaUser /> {testData.users.length}
        </div>
      </div>

      <div className="flex gap-3 pt-1 text-[#727272]">Department: </div>
      <div className="flex gap-3 pt-1 text-[#727272]">Semester: </div>

      <div className="flex border-[#D9D9D9] border text-[#5C7CD4] w-[22%] items-center justify-center rounded-[4px] py-1 shadow-md shadow-[#6386e7] mt-2 cursor-pointer">
        Student Performance
      </div>
    </div>
  );
}

export default SeparateTest;
