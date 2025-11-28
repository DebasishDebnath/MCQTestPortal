import React from "react";
import DashboardComponent from "../../components/Admin/DashboardComponent";

export default function Dashboard() {
  return (
    <div
      className="min-h-screen w-[100%] bg-[#313d55] bg-cover bg-center bg-blend-overlay pb-10 poppins"
      style={{
        backgroundImage: "url(/regbg.png)",
      }}
    >
      <div className="p-8">
        <DashboardComponent />
      </div>
    </div>
  );
}
