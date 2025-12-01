import React from "react";
import event from "../../../public/event.png";
function UpcomingTests() {
  return (
    <div className="bg-white rounded-[11.2px] text-[#202224] w-full p-4">
      <div className="flex justify-between">
        <div className="text-[#202224] text-[12px] mb-2">
          Upcoming Tests
          <div className="text-[#202224] text-[22.4px] mt-2 font-semibold">
            0  
          </div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-[#adbde983] h-[2%] w-[30%] rounded-[18.4px] flex items-center justify-center p-2.5">
          <img src={event} alt="" />
        </div>
      </div>
      <div className="text-[#7E7E7E] font-semibold text-[11px] mr-5">
       
        <div>Tests that are scheduled to publish soon</div>
      </div>
    </div>
  );
}

export default UpcomingTests;
