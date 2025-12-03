import React from "react";
import UserUpcomingTests from "./UserUpcomingTests";
import UserCompletedTests from "./UserCompletedTests";
import UserOngoingTests from "./UserOngoingTests";

function UserDashboardComponent({ ongoingTests, upcomingTests, completedTests }) {
  return (
    <div className="bg-indigo-100 w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col h-fit gap-6">
      <div className="grid grid-cols-2 gap-6 items-center justify-center w-full h-full">
        {/* <UserUpcomingTests tests={upcomingTests} /> */}
        {/* <UserCompletedTests tests={completedTests} /> */}
      </div>
      <div>
        <UserOngoingTests tests={ongoingTests} />
      </div>
    </div>
  );
}

export default UserDashboardComponent;
