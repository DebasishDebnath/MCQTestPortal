import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function Success({
  title = "Successfull!",
  subTitle = "",
  note = "You will be notified when it goes live",
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/Success.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-20 text-center flex flex-col items-center justify-center gap-4 max-w-3xl w-full">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24">
          {data && <Lottie animationData={data} loop={false} />}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-blue-theme">{title}</h2>

      <p className="text-xl font-semibold text-gray-600">{subTitle}</p>

      <p className="text-sm font-semibold text-gray-400">{note}</p>
    </div>
  );
}
