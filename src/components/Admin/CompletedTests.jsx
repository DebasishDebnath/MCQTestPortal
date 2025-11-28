// import React from 'react'

// function CompletedTests() {
//   return (
//     <div>CompletedTests</div>
//   )
// }

// export default CompletedTests



import React from "react";
import test from "../../../public/test.png";
function CompletedTests() {
  return (
    <div className="bg-white rounded-[11.2px] text-[#202224] w-full p-4">
      <div className="flex justify-between">
        <div className="text-[#202224] text-[12px] mb-2">
          Tests Created{" "}
          <div className="text-[#202224] text-[22.4px] mt-2 font-semibold">0</div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-[#adbde983] h-[2%] w-[30%] rounded-[18.4px] flex items-center justify-center p-2.5">
          <img src={test} alt="" />
        </div>
      </div>
      <div className="text-[#7E7E7E] font-semibold text-[11px] mr-5">
        <div>Number of completed,</div>
        <div> upcoming and ongoing tests.</div>
      </div>
    </div>
  );
}

export default CompletedTests;
