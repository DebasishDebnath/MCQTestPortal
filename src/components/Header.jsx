import React from "react";
import { useLocation } from "react-router-dom";
import { FaRegCircleDot, FaRegHourglassHalf } from "react-icons/fa6";

function Header() {
  const location = useLocation();
  const isTestPage = location.pathname.includes("/test/");
  return (
    <header className="bg-blue-theme w-full poppins">
      <div className="text-white px-6 flex justify-between items-center max-w-[1440px] mx-auto">
        <img src="/Group 57.png" alt="" />
        {isTestPage ? (
          <div className="flex justify-center items-center gap-3 text-sm">
            <FaRegHourglassHalf size={16} /> 10:46{" "}
            <FaRegCircleDot className="text-red-600" size={16} />
          </div>
        ) : (
          <div></div>
        )}
        {isTestPage ? (
          <button className="cursor-pointer w-fit py-1.5 px-6 bg-red-700 text-white rounded-full flex items-center justify-center gap-4 text-sm font-medium ml-50">
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
