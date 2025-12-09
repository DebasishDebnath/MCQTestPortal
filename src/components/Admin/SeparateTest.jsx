// import React, { useEffect, useState } from "react";
// import { IoMdTime } from "react-icons/io";
// import { FaUser } from "react-icons/fa6";
// import { GoDotFill } from "react-icons/go";
// import { TbEdit } from "react-icons/tb";
// import { useNavigate } from "react-router-dom";
// function SeparateTest({ testData }) {
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [status, setStatus] = useState("");
//   const navigate = useNavigate();
//   const handleNavigate = () => {
//     navigate("/admin/123/student-analytics");
//   };

//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);

//     const formattedDate = date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });

//     const formattedTime = date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "numeric",
//       hour12: true,
//     });

//     return `${formattedDate} • ${formattedTime}`;
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = new Date();
//       const start = new Date(testData.startDate);
//       const diffMs = start - now; // milliseconds

//       if (diffMs > 0) {
//         const diffMinutes = Math.floor(diffMs / 60000);

//         if (diffMinutes > 30) {
//           setStatus("future"); // Test is NOT in 30 min window
//           setTimeLeft(null);
//         } else {
//           setStatus("upcoming"); // Test starts in < 30 minutes
//           setTimeLeft(diffMinutes);
//         }
//       } else {
//         // Test has started
//         const ongoingMinutes = Math.floor(Math.abs(diffMs) / 60000);

//         if (ongoingMinutes <= 30) {
//           setStatus("ongoing"); // For first 30 mins after start
//           setTimeLeft(30 - ongoingMinutes);
//         } else {
//           setStatus("closed"); // More than 30 min after start
//           setTimeLeft(null);
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [testData.startDate]);

//   const handleExamDetailsEdit = () => {};

//   return (
//     <div className="border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-2 w-full">
//       <div className="flex gap-3 relative">
//         <div className="bg-indigo-100 text-indigo-400 rounded-sm px-2 py-1 flex items-center text-xs">
//           {formatDateTime(testData.startDate)}
//         </div>

//         {/* Status badge */}
//         {status === "future" && (
//           <div className="bg-indigo-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
//             Upcoming
//           </div>
//         )}

//         {status === "upcoming" && (
//           <div className="bg-indigo-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
//             Starts in {timeLeft} min
//           </div>
//         )}

//         {status === "ongoing" && (
//           <div className="bg-green-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
//             Ongoing • {timeLeft} min left
//           </div>
//         )}
//         <div
//           className="flex items-end justify-end absolute right-0 top-0 cursor-pointer"
//           onClick={handleExamDetailsEdit}
//         >
//           {(status === "future" || status === "upcoming") && (
//             <button className="text-indigo-400 cursor-pointer">
//               <TbEdit size={25} />
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="text-lg font-medium flex flex-col ">{testData.title}</div>

//       <div className="flex flex-col text-gray-500 text-sm h-full w-full">
//         <div className="flex gap-3 items-center">
//           <div className="flex items-center">
//             {testData.questions.length} Questions
//           </div>
//           <GoDotFill size={10} />
//           <div className="flex items-center">{testData.totalMarks} Marks</div>
//           <GoDotFill size={10} />
//           <div className="flex items-center gap-1">
//             <IoMdTime className="text-gray-800" size={18} />{" "}
//             {testData.durationMinutes} minutes
//           </div>
//           <GoDotFill size={10} />
//           <div className="flex items-center gap-1">
//             <FaUser className="text-gray-800" size={14} />{" "}
//             {testData.users.length}
//           </div>
//         </div>
//         <div className="pt-2">Exam Mode: {testData.type}</div>
//         <div className="flex gap-3 pt-1">Department: {testData.department}</div>
//         <div className="flex gap-3 pt-1">Semester: {testData.semester}</div>
//       </div>

//       <div className="flex border-indigo-400 border text-indigo-400 w-fit items-center justify-center rounded-md py-1 px-4 shadow-md shadow-indigo-200 mt-2 cursor-pointer" onClick={handleNavigate}>
//         Student Performance
//       </div>
//     </div>
//   );
// }

// export default SeparateTest;

import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function SeparateTest({ testData }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  console.log(testData, "separate");
  const handleNavigate = () => {
    navigate("/admin/123/student-analytics");
  };

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
    const updateStatus = () => {
      const now = new Date();
      const start = new Date(testData.startDate);

      // Check if date is valid
      if (isNaN(start.getTime())) {
        console.error("Invalid startDate:", testData.startDate);
        setStatus("future");
        return;
      }

      const end = new Date(start.getTime() + testData.durationMinutes * 60000);
      const diffMs = start - now;

      // Debug logs (remove after fixing)
      console.log("Test:", testData.title);
      console.log("Now:", now.toISOString());
      console.log("Start:", start.toISOString());
      console.log("End:", end.toISOString());
      console.log("Diff to start (ms):", diffMs);
      console.log("Diff to end (ms):", end - now);

      if (diffMs > 0) {
        // Test hasn't started yet
        const diffMinutes = Math.floor(diffMs / 60000);

        if (diffMinutes > 30) {
          setStatus("future");
          setTimeLeft(null);
        } else {
          setStatus("upcoming");
          setTimeLeft(diffMinutes);
        }
      } else if (now < end) {
        // Test is ongoing (started but not ended)
        setStatus("ongoing");
        const remainingMs = end - now;
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        setTimeLeft(remainingMinutes);
      } else {
        // Test has ended
        setStatus("closed");
        setTimeLeft(null);
      }
    };

    // Initial update
    updateStatus();

    // Update every second
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [testData.startDate, testData.durationMinutes, testData.title]);

  const handleExamDetailsEdit = () => {};

  return (
    <div className="border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-2 w-full">
      <div className="flex gap-3 relative">
        <div className="bg-indigo-100 text-indigo-400 rounded-sm px-2 py-1 flex items-center text-xs">
          {formatDateTime(testData.startDate)}
        </div>

        {/* Status badge */}
        {status === "future" && (
          <div className="bg-indigo-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
            Upcoming
          </div>
        )}

        {status === "upcoming" && (
          <div className="bg-indigo-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
            {timeLeft} min left to go live
          </div>
        )}

        {status === "ongoing" && (
          <div className="bg-green-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
            Ongoing • {timeLeft} min left
          </div>
        )}

        {status === "closed" && (
          <div className="bg-gray-400 px-3 text-white flex items-center text-xs justify-center rounded-sm py-1">
            Closed
          </div>
        )}

        <div
          className="flex items-end justify-end absolute right-0 top-0 cursor-pointer"
          onClick={handleExamDetailsEdit}
        >
          {(status === "future" || status === "upcoming") && (
            <button className="text-indigo-400 cursor-pointer">
              <TbEdit size={25} />
            </button>
          )}
        </div>
      </div>

      <div className="text-lg font-medium flex flex-col">{testData.title}</div>

      <div className="flex flex-col text-gray-500 text-sm h-full w-full">
        <div className="flex gap-3 items-center">
          <div className="flex items-center">
            {testData.questions.length} Questions
          </div>
          <GoDotFill size={10} />
          <div className="flex items-center">{testData.totalMarks} Marks</div>
          <GoDotFill size={10} />
          <div className="flex items-center gap-1">
            <IoMdTime className="text-gray-800" size={18} />{" "}
            {testData.durationMinutes} minutes
          </div>
          <GoDotFill size={10} />
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-800" size={14} />{" "}
            {testData.users.length}
          </div>
        </div>
        <div className="pt-2">Exam Mode: {testData.type}</div>
        <div className="flex gap-3 pt-1">Department: {testData.department}</div>
        <div className="flex gap-3 pt-1">Semester: {testData.semester}</div>
      </div>

      <div
        className="flex border-indigo-400 border text-indigo-400 w-fit items-center justify-center rounded-md py-1 px-4 shadow-md shadow-indigo-200 mt-2 cursor-pointer"
        onClick={handleNavigate}
      >
        Student Performance
      </div>
    </div>
  );
}

export default SeparateTest;
