import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Success from "../../components/common/Success";

export default function Schedule({
  title = "Test Scheduled Successfully!",
  date = "Nov 10, 2025",
  startTime = "10:00 AM",
  endTime = "12:00 PM",
  note = "You will be notified when it goes live",
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/Success.json") // your Lottie file in public folder
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const subTitle = `${date}, ${startTime} - ${endTime}`;

  return (
    <div
      className="min-h-full w-full bg-cover bg-center poppins bg-no-repeat bg-[#313d55] bg-blend-overlay relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      <Success title={title} subTitle={subTitle} note={note} />
    </div>
  );
}
