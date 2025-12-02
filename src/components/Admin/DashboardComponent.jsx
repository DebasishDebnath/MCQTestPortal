import TestsCreated from "./TestsCreated";
import UpcomingTests from "./UpcomingTests";
import OngoingTests from "./OngoingTests";
import CompletedTests from "./CompletedTests";
import AllTestShow from "../../components/Admin/AllTestShow";
import React from "react";
function DashboardComponent() {
  return (
    <div className="bg-indigo-100 w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col h-fit gap-6">
      <div className="grid grid-cols-4 gap-6 items-center justify-center w-full h-full">
        <TestsCreated />
        <UpcomingTests />
        <OngoingTests />
        <CompletedTests />
      </div>
      <div>
        <AllTestShow />
      </div>
    </div>
  );
}

export default DashboardComponent;
