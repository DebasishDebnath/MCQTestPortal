import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaRegCircleDot, FaRegHourglassHalf } from "react-icons/fa6";
import iem from "/iem.png";
import uem from "/uem.png";
import { User } from "lucide-react";
import { useHttp } from "../hooks/useHttp.jsx";
import moment from "moment";

function Header() {
  const { get, post } = useHttp();
  const location = useLocation();
  const navigate = useNavigate();
  const { testid } = useParams();
  const isTestPage = location.pathname.includes("/test-page/");
  const isDashboard = location.pathname === "/dashboard";

  // Profile logic...
  const [firstName, setFirstName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  // Timer logic
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(null);

  useEffect(() => {
    if (isTestPage) {
      // First check localStorage for existing timer
      const storedEndTime = localStorage.getItem(`examEndTime_${testid}`);

      if (storedEndTime) {
        // Use stored end time
        const endTime = moment(storedEndTime);
        const secondsLeft = endTime.diff(moment(), "seconds");

        if (secondsLeft > 0) {
          setTimeLeft(secondsLeft);

          const timer = setInterval(() => {
            const secondsLeft = endTime.diff(moment(), "seconds");
            setTimeLeft(secondsLeft);
            if (secondsLeft <= 0) {
              setTimerExpired(true);
              clearInterval(timer);
              localStorage.removeItem(`examEndTime_${testid}`);
            }
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setTimerExpired(true);
        }
      } else if (location.state && location.state.durationMinutes) {
        // Initialize new timer
        setDurationMinutes(location.state.durationMinutes);
        const endTime = moment().add(location.state.durationMinutes, "minutes");

        // Store end time in localStorage
        localStorage.setItem(`examEndTime_${testid}`, endTime.toISOString());

        setTimeLeft(endTime.diff(moment(), "seconds"));

        const timer = setInterval(() => {
          const secondsLeft = endTime.diff(moment(), "seconds");
          setTimeLeft(secondsLeft);
          if (secondsLeft <= 0) {
            setTimerExpired(true);
            clearInterval(timer);
            localStorage.removeItem(`examEndTime_${testid}`);
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [isTestPage, location.state, testid]);

  // Auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && isTestPage) {
      const submitExam = async () => {
        const token = localStorage.getItem("userToken");
        const res = await post(
          "/api/exam/submit",
          { examId: testid },
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (res && res.success) {
          navigate(`/test/thankyou/${testid}`);
        } else {
          window.dispatchEvent(new CustomEvent("openFinalSubmission"));
        }
      };
      submitExam();
    }
  }, [timerExpired, isTestPage, post, testid, navigate]);

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, "seconds");
    const min = String(duration.minutes()).padStart(2, "0");
    const sec = String(duration.seconds()).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      get("/api/users/profile", { Authorization: `Bearer ${token}` })
        .then((data) => {
          if (data && data.data) {
            const name = data.data.name || "User";
            const image = data.data.profileImage || null;

            localStorage.setItem("firstName", name);
            setFirstName(name);

            if (image) {
              localStorage.setItem("Image", image);
              setProfilePic(image);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
          // Fallback to localStorage if API fails
          setFirstName(localStorage.getItem("firstName") || "User");
          setProfilePic(localStorage.getItem("Image") || null);
        });
    } else {
      // No token, use localStorage values
      setFirstName(localStorage.getItem("firstName") || "User");
      setProfilePic(localStorage.getItem("Image") || null);
    }
  }, [get, location.pathname]);

  return (
    <header className="bg-blue-theme w-full poppins">
      <div className="text-white px-6 flex justify-between items-center max-w-[1440px] mx-auto">
        <div className="flex items-start">
          <img src={iem} alt="" className=" w-22" />
          <img src={uem} alt="" className=" w-22" />
        </div>
        {isTestPage ? (
          <div className="flex justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-3">
              <FaRegHourglassHalf size={18} />
              <span className="font-bold text-lg">
                {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
              </span>
              <FaRegCircleDot className="text-red-600" size={18} />
            </div>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openFinalSubmission"))
              }
              className="cursor-pointer w-fit py-1.5 px-6 bg-red-700 text-white rounded-full flex items-center justify-center gap-4 text-sm font-medium ml-10 hover:bg-red-800 transition"
            >
              Finish Test
            </button>
          </div>
        ) : isDashboard ? (
          <div className="absolute top-4 right-4 flex items-end gap-4">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 rounded-full bg-gray-300 items-center justify-center border ${
                profilePic ? "hidden" : "flex"
              }`}
            >
              <User size={20} className="text-gray-600" />
            </div>
            <span className="font-semibold text-white">
              {firstName || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:shadow-lg hover:scale-105 hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
}

export default Header;
