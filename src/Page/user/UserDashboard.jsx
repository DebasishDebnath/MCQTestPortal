import React, { useEffect, useState } from "react";
import UserDashboardComponent from "../../components/user/UserDashboardComponent.jsx";
import { useHttp } from "../../hooks/useHttp.jsx";

export default function UserDashboard() {
  const { get } = useHttp();
  const [exams, setExams] = useState({
    live: [],
    draft: [],
    closed: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      get("/api/users/profile", { Authorization: `Bearer ${token}` })
        .then((data) => {
          if (data && data.data && data.data.exams) {
            setExams({
              live: data.data.exams.live || [],
              draft: data.data.exams.draft || [],
              closed: data.data.exams.closed || [],
            });
          }
        });
    }
  }, [get]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div
        className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center xl:p-20 p-10 bg-blend-overlay poppins"
        style={{
          backgroundImage: "url(/regbg.png)",
        }}
      >
        <UserDashboardComponent
          ongoingTests={exams.live}
          upcomingTests={exams.draft}
          completedTests={exams.closed}
        />
      </div>
    </div>
  );
}
