import React from "react";
import liveStreaming from "/live-streaming.png";
function OngoingTests() {
  return (
    <div className="bg-white rounded-2xl w-full p-6 poppins flex flex-col gap-2 h-full">
      <div className="flex justify-between gap-4">
        <div className="text-gray-700 text-md flex flex-col gap-2">
          Ongoing Tests{" "}
          <div className="text-gray-700 text-2xl font-semibold">0</div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-indigo-100 h-[44px] w-[50px] rounded-2xl flex items-center justify-center p-2">
          <img src={liveStreaming} alt="" />
        </div>
      </div>
      <div className="text-gray-500 font-medium text-xs ">
        Live tests currently
        <br /> active for students.
      </div>
    </div>
  );
}

export default OngoingTests;
