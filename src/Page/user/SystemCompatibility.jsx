import React, { useEffect, useState } from "react";
import { FaHourglassHalf } from "react-icons/fa6";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaPuzzlePiece } from "react-icons/fa6";
import { FaCamera, FaMicrophone, FaWifi } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { FaCheck, FaTimes } from "react-icons/fa";

function SystemCompatibility() {
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
      // Use a reliable endpoint and measure latency more accurately
      const response = await fetch("https://www.google.com/generate_204", { mode: "no-cors" });
      const latency = Date.now() - start;

      // Allow higher latency threshold (e.g., 1000ms)
      setNetworkOk(latency < 1000);
    } catch {
      setNetworkOk(false);
    }
  }

  useEffect(() => {
    setLoading(true); // Start loading immediately when page loads

    async function runChecks() {
      await checkCamera();
      await checkMic();
      await checkNetwork();
      setLoading(false); // Stop loading after all checks
    }

    // Only run checks if in fullscreen
    if (document.fullscreenElement) {
      runChecks();
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().then(runChecks);
      } else {
        runChecks();
      }
    }
  }, []);

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
    <>
      {/* Full Page Background */}
      <div
        className=" h-full h-screen overflow-hidden flex bg-[#313d55] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white"
        style={{ backgroundImage: "url(/regbg.png)" }}
      >
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between items-center p-18">
          <div className="items-center p-20">
            <h1 className="text-6xl font-bold mb-4 leading-tight poppins-regular">Welcome to</h1>
            <h1 className="text-5xl font-bold mb-4  poppins-bold mt-10">Assessment 1</h1>
            <p className="poppins-medium mt-9 text-base">
              Read the instructions carefully after System test
            </p>

            {/* Stats Row */}
            <div className="flex justify-center items-center gap-28 mt-8 poppins-regular text-xl text-[#999999]">
              {/* Duration */}
              <div className="flex flex-col items-center pr-12 border-r border-white/40">
                <span className="poppins-semibold underline">Duration</span>
                <div className="flex items-center gap-2 mt-2">
                  <FaHourglassHalf className="text-[white] w-7 h-7" />
                  <span className="text-2xl poppins-semibold text-white ">1 hr</span>
                </div>
              </div>

              {/* Questions */}
              <div className="flex flex-col items-center pr-12 border-r border-white/40">
                <span className="poppins-semibold underline">Questions</span>
                <div className="flex items-center gap-2 mt-2">
                  <HiOutlineDocumentText className="text-[white] w-7 h-7" />
                  <span className="text-2xl poppins-semibold text-white ">60</span>
                </div>
              </div>

              {/* Sections */}
              <div className="flex flex-col items-center pr-12">
                <span className="poppins-semibold underline">Sections</span>
                <div className="flex items-center gap-2 mt-2">
                  <FaPuzzlePiece className="text-[white] w-7 h-7" />
                  <span className="text-2xl poppins-semibold text-white ">4</span>
                </div>
              </div>
            </div>
          </div>
          <footer className="text-sm text-slate-300 ">
            © IEM - UEM Group. All Rights Reserved.
          </footer>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center h-full">
          {/* Help Button */}
          <div className="absolute bottom-8 right-8 z-10">
            <button className="text-sm text-slate-200 hover:text-white font-medium">
              Need Help?
            </button>
          </div>

          {/* Card */}
          <div className="w-full max-w-xl bg-white text-[#09163A] rounded-3xl shadow-xl p-8 flex flex-col justify-center">
            <h2 className="text-3xl poppins-bold mb-2">System Compatibility Check</h2>
            {loading ? (
              <div className="flex items-center gap-3 mb-6">
                <ImSpinner8 className="animate-spin text-gray-500 text-2xl" />
                <span className="text-[#999999] poppins-semibold">
                  performing compatibility tests...
                </span>
              </div>
            ) : (
              <p className="text-[#999999] poppins-semibold mb-6"></p>
            )}

            {/* ⭐ Compatibility Test List ⭐ */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <div className="flex items-center gap-3">
                  <FaCamera className="text-xl text-[#09163A]" />
                  Camera access
                </div>
                <StatusIcon status={cameraOk} />
              </div>

              <div className="flex items-center justify-between text-lg font-medium">
                <div className="flex items-center gap-3">
                  <FaMicrophone className="text-xl text-[#09163A]" />
                  Microphone access
                </div>
                <StatusIcon status={micOk} />
              </div>

              <div className="flex items-center justify-between text-lg font-medium">
                <div className="flex items-center gap-3">
                  <FaWifi className="text-xl text-[#09163A]" />
                  Network stability
                </div>
                <StatusIcon status={networkOk} />
              </div>
            </div>

            {/* Proceed Button */}
            <button
              disabled={loading || !(cameraOk && micOk && networkOk)}
              className={`mt-10 w-full py-3 text-white rounded-xl poppins-semibold transition ${
                cameraOk && micOk && networkOk
                  ? "bg-[#0a1a44] hover:bg-[#081536]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SystemCompatibility;
