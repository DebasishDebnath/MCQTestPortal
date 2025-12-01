import React from "react";
import { useLocation } from "react-router-dom";
import { FaRegCircleDot, FaRegHourglassHalf } from "react-icons/fa6";
import iem from ".././../public/iem.png";
import uem from ".././../public/uem.png";
function Header() {
  const location = useLocation();
  const isTestPage = location.pathname.includes("/test/");
  return (
    <header className="bg-blue-theme w-full poppins">
      <div className="text-white px-6 flex justify-between items-center max-w-[1440px] mx-auto">
        <div className="flex items-start">
          <img src={iem} alt="" className=" w-22" />
          <img src={uem} alt="" className=" w-22" />
        </div>
        {isTestPage ? (
          <div className="flex justify-center items-center gap-3 text-sm">
            <FaRegHourglassHalf size={16} /> 10:46{" "}
            <FaRegCircleDot className="text-red-600" size={16} />
          </div>
        ) : (
          <div></div>
        )}
        {isTestPage ? (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openFinalSubmission'))}
            className="cursor-pointer w-fit py-1.5 px-6 bg-red-700 text-white rounded-full flex items-center justify-center gap-4 text-sm font-medium ml-10"
          >
            Finish Test
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
}

export default Header;
