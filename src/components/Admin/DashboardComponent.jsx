import TestsCreated from "./TestsCreated";
import UpcomingTests from "./UpcomingTests";
import OngoingTests from "./OngoingTests";
import CompletedTests from "./CompletedTests";
import AllTestShow from "../../components/admin/AllTestShow";
import React from "react";
function DashboardComponent() {
  return (
    <div className="bg-[#D3DFFF] rounded-[25px] px-6 ">
      <div className="flex gap-10 py-[5%]  items-center justify-center">
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
