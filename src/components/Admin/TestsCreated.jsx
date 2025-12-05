import React from "react";
import test from "/test.png";
function TestsCreated() {
  return (
    <div className="bg-white rounded-2xl w-full p-6 poppins flex flex-col gap-2 h-full">
      <div className="flex justify-between gap-4">
        <div className="text-gray-700 text-md flex flex-col gap-2">
          Tests Created{" "}
          <div className="text-gray-700 text-2xl font-semibold">0</div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-indigo-100 h-11 w-[50px] rounded-2xl flex items-center justify-center p-2">
          <img src={test} alt="" />
        </div>
      </div>
      <div className="text-gray-500 font-medium text-xs ">
        Number of completed, <br />
        upcoming and ongoing tests.
      </div>
    </div>
  );
}

export default TestsCreated;
