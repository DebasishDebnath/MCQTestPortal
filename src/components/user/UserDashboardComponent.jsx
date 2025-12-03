


import React from "react";
import UserUpcomingTests from "./UserUpcomingTests";
import UserOngoingTests from "./UserOngoingTests";
import UserCompletedTests from "./UserCompletedTests";
import UserAllTestShow from "./UserAllTestShow";
function UserDashboardComponent() {
  return (
    <div className="bg-indigo-100 w-full max-w-7xl rounded-3xl shadow-xl p-10 flex flex-col h-fit gap-6">
      <div className="grid grid-cols-3 gap-6 items-center justify-center w-full h-full">

        <UserUpcomingTests />
        <UserOngoingTests />
        <UserCompletedTests />
      </div>
      <div>
        <UserAllTestShow />
      </div>
    </div>
  );
}

export default UserDashboardComponent;
