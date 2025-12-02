import React from "react";
import DashboardComponent from "../../components/Admin/DashboardComponent.jsx";
export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full ">
      {/* Your sidebar component here */}

      <div
        className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center xl:p-20 p-10 bg-blend-overlay poppins"
        style={{
          backgroundImage: "url(/regbg.png)",
        }}
      >
          <DashboardComponent />
      </div>
    </div>
  );
}
