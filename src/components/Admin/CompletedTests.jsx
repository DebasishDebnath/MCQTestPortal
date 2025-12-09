import React from "react";
import complete from "/complete.png";
function CompletedTests({testCount}) {
  return (
    <div className="bg-white rounded-2xl w-full p-6 poppins flex flex-col gap-2 h-full shadow-md">
      <div className="flex justify-between gap-4">
        <div className="text-gray-700 text-md flex flex-col gap-2">
          Completed Tests{" "}
          <div className="text-gray-700 text-2xl font-semibold">{testCount}</div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-indigo-100 h-[44px] w-[50px] rounded-2xl flex items-center justify-center p-2">
          <img src={complete} alt="" />
        </div>
      </div>
      <div className="text-gray-500 font-medium text-xs ">
        Count of tests
        <br /> successfully submitted.
      </div>
    </div>
  );
}

export default CompletedTests;
