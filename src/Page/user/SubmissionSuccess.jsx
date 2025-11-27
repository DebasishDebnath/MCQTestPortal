import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function SubmissionSuccess({ answered = 0, total = 0 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/Success.json")       
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div
      className="min-h-full w-full bg-cover bg-center poppins bg-no-repeat bg-[#313d55]/80 bg-blend-overlay relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      <div className="bg-white w-[600px] h-[340px] rounded-[25px] shadow-xl p-12 text-center flex flex-col items-center justify-center">
        
        {/* Lottie Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24">
            {data && <Lottie animationData={data} loop={false} />}
          </div>
        </div>

        <h2 className="text-[22px] font-semibold text-[#0E2258] mb-2">
          You have submitted the exam successfully!
        </h2>

        <p className="text-[18px] text-[#5C5B5B] mb-1">
          You have answered <span className="font-bold">{answered}</span> out of{" "}
          <span className="font-bold">{total}</span> questions
        </p>

        <p className="text-base font-semibold text-[#999999] mt-2">
          You may now close the window
        </p>
      </div>
    </div>
  );
}
