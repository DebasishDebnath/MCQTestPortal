import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Success from "../../components/common/Success";
import moment from "moment";

export default function SubmissionSuccess() {
  const [secondsLeft, setSecondsLeft] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  // Get answered from navigation state, fallback to 0
  const answered = location.state?.answered ?? 0;

  useEffect(() => {
    const end = moment().add(10, "seconds");
    const interval = setInterval(() => {
      const diff = end.diff(moment(), "seconds");
      setSecondsLeft(diff >= 0 ? diff : 0);
      if (diff <= 0) {
        clearInterval(interval);
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const subTitle = `You have answered ${answered} questions`;

  return (
    <div
      className="min-h-full w-full bg-cover bg-center poppins bg-no-repeat bg-[#313d55] bg-blend-overlay relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      <Success
        title="You have submitted the exam successfully!"
        subTitle={subTitle}
        note={
          <>
            You may now close the window. You will be redirected to login in{" "}
            <span className="text-red-600 font-bold">
              {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}
            </span>.
          </>
        }
      />
    </div>
  );
}
