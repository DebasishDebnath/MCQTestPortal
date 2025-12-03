import React from "react";
import complete from "/complete.png";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
function UserCompletedTests() {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl w-full p-6 poppins flex flex-col gap-2 h-full">
      <div className="flex justify-between gap-4">
        <div className="text-gray-700 text-md flex flex-col gap-2">
          Completed Tests{" "}
          <div className="text-gray-700 text-2xl font-semibold">0</div>
        </div>
        {/* <div>0</div> */}
        <div className="bg-indigo-100 h-[44px] w-[50px] rounded-2xl flex items-center justify-center p-2">
          <img src={complete} alt="" />
        </div>
      </div>
      <div className="text-gray-500 font-medium text-base flex justify-start">
  <button
    className="p-2 px-3 bg-white text-indigo-600  
               rounded-xl shadow-md hover:bg-indigo-50 hover:border-indigo-500
               hover:shadow-lg ease-out hover:cursor-pointer hover:scale-102 transition-transform duration-200 flex items-center gap-2"
    onClick={() => navigate("/completed-tests")}
  >
    View All<ArrowRight />
  </button>
</div>


    </div>
  );
}

export default UserCompletedTests;
