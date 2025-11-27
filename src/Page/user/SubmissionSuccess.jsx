import React from "react";

export default function SubmissionSuccess({ answered = 0, total = 0 }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center poppins bg-no-repeat bg-[#313d55]/80 bg-blend-overlay relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      {/* Main Card */}
      <div className="bg-white w-[822px] h-[406px] rounded-[25px] shadow-xl p-12 text-center flex flex-col items-center justify-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-semibold text-[#0E2258] mb-2">
          You have submitted the exam successfully!
        </h2>

        {/* Dynamic Answer Count */}
        <p className="text-[18px] text-[#5C5B5B] mb-1">
          You have answered <span className="font-bold">{answered}</span> out of {" "}
          <span className="font-bold">{total}</span> questions
        </p>

        {/* Subtext */}
        <p className="text-base font-semibold text-[#999999] mt-2">You may now close the window</p>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-300 absolute bottom-6 left-6">
        © IEM-UEM Group. All Rights Reserved.
      </p>

      <button className="text-xs text-slate-200 absolute bottom-6 right-6">
        Need Help?
      </button>
    </div>
  );
}