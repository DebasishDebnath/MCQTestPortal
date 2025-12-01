import React from "react";
import complete from "../../../public/complete.png";
function CompletedTests() {
  return (
    <div className="bg-white rounded-[11.2px] text-[#202224] w-full p-4">
      <div className="flex justify-between">
        <div className="text-[#202224] text-[12px] mb-2">
          Completed Tests
          <div className="text-[#202224] text-[22.4px] mt-2 font-semibold">
            0
          </div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-[#adbde983] h-[2%] w-[30%] rounded-[18.4px] flex items-center justify-center p-2.5">
          <img src={complete} alt="" />
        </div>
      </div>
      <div className="text-[#7E7E7E] font-semibold text-[11px] mr-5">
        <div> Count of tests successfully submitted</div>
      </div>
    </div>
  );
}

export default CompletedTests;
