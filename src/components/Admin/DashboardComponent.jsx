import TestsCreated from "./TestsCreated";
import UpcomingTests from "./UpcomingTests";
import OngoingTests from "./OngoingTests";
import CompletedTests from "./CompletedTests";
import AllTestShow from "../../components/Admin/AllTestShow";
import { useHttp } from "./../../hooks/useHttp.jsx";
import React, { useEffect, useState } from "react";

function DashboardComponent() {
  const { get, loading } = useHttp();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const data = await get("/api/exam/getAllExams", {
            Authorization: `Bearer ${token}`,
          });
          setResponse(data?.data);
          // console.log(data);
          
        } catch (error) {
          console.error("Failed to fetch exams:", error);
        }
      }
    };

    fetchExams();
  }, [get]);

  return (
    <div className="bg-indigo-100 w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col h-fit gap-6">
      <div className="grid grid-cols-4 gap-6 items-center justify-center w-full h-full">
        <TestsCreated testCount={response?.totalCount} />
        <UpcomingTests testCount={response?.draft} />
        <OngoingTests testCount={response?.live} />
        <CompletedTests testCount={response?.closed} />
      </div>
      <div>
        <AllTestShow response={response} />
      </div>
    </div>
  );
}

export default DashboardComponent;
