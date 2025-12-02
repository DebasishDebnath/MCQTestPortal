import React from "react";
import TestDetailComponent from "../../components/Admin/TestDetailComponent";
export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full ">
      {/* Your sidebar component here */}

      <div
        className="flex w-full min-h-screen bg-[#313d55] bg-cover bg-center justify-center py-[5%] bg-blend-overlay pb-10 poppins"
        style={{
          backgroundImage: "url(/regbg.png)",
        }}
      >
          <TestDetailComponent />
      </div>
    </div>
  );
}
