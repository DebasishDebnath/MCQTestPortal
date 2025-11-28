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
      <div className="bg-white rounded-2xl shadow-xl p-20 text-center flex flex-col items-center justify-center gap-4 max-w-[1440px]">
        
        {/* Lottie Animation */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24">
            {data && <Lottie animationData={data} loop={false} />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-blue-theme">
          You have submitted the exam successfully!
        </h2>

        <p className="text-xl font-semibold text-gray-600">
          You have answered <span className="font-bold">{answered}</span> out of{" "}
          <span className="font-bold">{total}</span> questions
        </p>

        <p className="text-sm font-semibold text-gray-400">
          You may now close the window
        </p>
      </div>
    </div>
  );
}
