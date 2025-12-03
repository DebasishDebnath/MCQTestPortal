import React, { useEffect, useState } from "react";
import { FaRegHourglassHalf, FaChartPie, FaFileLines } from "react-icons/fa6";
import { FaCamera, FaMicrophone, FaWifi } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";


function SystemCompatibility() {
  const { testid } = useParams();
  const navigate = useNavigate();
  
  const [cameraOk, setCameraOk] = useState(null);
  const [micOk, setMicOk] = useState(null);
  const [networkOk, setNetworkOk] = useState(null);
  const [loading, setLoading] = useState(true);

  // CAMERA CHECK
  async function checkCamera() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraOk(true);
    } catch {
      setCameraOk(false);
    }
  }

  // MICROPHONE CHECK
  async function checkMic() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicOk(true);
    } catch {
      setMicOk(false);
    }
  }

  // NETWORK CHECK
  async function checkNetwork() {
    const start = Date.now();
    try {
      await fetch("https://www.google.com/generate_204", { mode: "no-cors" });
      const latency = Date.now() - start;
      setNetworkOk(latency < 1000);
    } catch {
      setNetworkOk(false);
    }
  }

  useEffect(() => {
    setLoading(true);

    async function runChecks() {
      await checkCamera();
      await checkMic();
      await checkNetwork();
      setLoading(false);
    }

    runChecks();
  }, []);

  // Request full screen and navigate to instruction
  const handleProceed = () => {
    if (cameraOk && micOk && networkOk) {
      // Request full screen
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          navigate(`/instruction/${testid}`); // ✅ Use dynamic testid
        });
      } else {
        // Fallback for browsers not supporting requestFullscreen
        navigate(`/instruction/${testid}`); // ✅ Use dynamic testid
      }
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === null)
      return (
        <div className="flex items-center justify-center">
          <ImSpinner8 className="animate-spin text-gray-400 text-xl" />
        </div>
      );

    if (status === true)
      return (
        <div className="flex items-center justify-center">
          <FaCheck className="text-green-600 text-2xl" />
        </div>
      );

    return (
      <div className="flex items-center justify-center">
        <FaTimes className="text-red-600 text-2xl" />
      </div>
    );
  };

  return (
    <div
      className="h-full flex bg-[#313d55] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white w-full pb-10 poppins"
      style={{ backgroundImage: "url(/regbg.png)" }}
    >
      <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 justify-between items-center poppins gap-6 items-start p-6">
          <h1 className="text-5xl font-medium leading-tight">Welcome to</h1>
          <h1 className="text-6xl font-semibold">
            Assessment 1
          </h1>
          <p className="text-lg">
            Read the instructions carefully after System test
          </p>

          {/* Stats Row */}
          <div className="flex justify-center items-center gap-8 mt-12 text-gray-theme">
            {/* Duration */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold px-2 text-md">Duration</span>
              <div className="w-full h-px bg-gray-theme"></div>
              <div className="flex items-center gap-2 mt-2">
                <FaRegHourglassHalf className="text-white/90" size={20} />
                <span className="text-2xl font-bold text-white/90 ">
                  1 hr
                </span>
              </div>
            </div>

            <div className="w-px h-16 bg-gray-theme"></div>

            {/* Questions */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold px-2 text-md">Questions</span>              
              <div className="w-full h-px bg-gray-theme"></div>
              <div className="flex items-center gap-2 mt-2">
                <FaFileLines className="text-white/90" size={20} />
                <span className="text-2xl font-bold text-white/90 ">
                  60
                </span>
              </div>
            </div>

            <div className="w-px h-16 bg-gray-theme"></div>

            {/* Sections */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold px-2 text-md">Sections</span>
              <div className="w-full h-px bg-gray-theme"></div>
              <div className="flex items-center gap-2 mt-2">
                <FaChartPie className="text-white/90" size={20} />
                <span className="text-2xl font-bold text-white/90 ">4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-semibold mb-8 mt-4">
              System Compatibility Check
            </h2>
            {loading ? (
              <div className="flex items-center gap-3 mb-6">
                <ImSpinner8 className="animate-spin text-gray-500 text-2xl" />
                <span className="text-gray-theme poppins-semibold">
                  performing compatibility tests...
                </span>
              </div>
            ) : (
              <p className="text-gray-theme poppins-semibold mb-6"></p>
            )}

            {/* ⭐ Compatibility Test List ⭐ */}
            <div className="flex flex-col gap-6 text-blue-theme text-lg font-semibold">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCamera className="" />
                  Camera access
                </div>
                <StatusIcon status={cameraOk} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaMicrophone className="" />
                  Microphone access
                </div>
                <StatusIcon status={micOk} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaWifi className="" />
                  Network stability
                </div>
                <StatusIcon status={networkOk} />
              </div>
            </div>

            {/* Proceed Button */}
            <button
              disabled={loading || !(cameraOk && micOk && networkOk)}
              className={`py-1.5 px-10 text-white rounded-full flex items-center justify-center gap-4 mt-10 ${
                cameraOk && micOk && networkOk
                  ? "bg-blue-theme cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemCompatibility;
