import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import Success from "../../components/common/Success";

export default function ScheduleSuccess() {
  const [data, setData] = useState(null);
  const location = useLocation();
  const testDetails = location.state;

  useEffect(() => {
    fetch("/Success.json") // your Lottie file in public folder
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);
  
  const date = testDetails?.startDateTime ? dayjs(testDetails.startDateTime).format("MMM DD, YYYY") : "N/A";
  const startTime = testDetails?.startDateTime ? dayjs(testDetails.startDateTime).format("hh:mm A") : "";
  const endTime = testDetails?.endDateTime ? dayjs(testDetails.endDateTime).format("hh:mm A") : "";
  
  const subTitle = `${date}, ${startTime} - ${endTime}`;
  return (
    <div
      className="min-h-full w-full bg-cover bg-center poppins bg-no-repeat bg-[#313d55] bg-blend-overlay relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      <Success title="Test Scheduled Successfully!" subTitle={subTitle} note="You will be notified when it goes live" url="/dashboard" />
    </div>
  );
}
