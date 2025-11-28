import TestsCreated from "./TestsCreated";
import UpcomingTests from "./UpcomingTests";
import OngoingTests from "./OngoingTests";
import CompletedTests from "./CompletedTests";
import React from "react";
function DashboardComponent() {
  return (
    <div>
      <div className="flex gap-10 bg-[#D3DFFF] px-6 py-10 rounded-[25px] items-center justify-center">
        <TestsCreated />
        <UpcomingTests />
        <OngoingTests />
        <CompletedTests />
      </div>
    </div>
  );
}

export default DashboardComponent;
