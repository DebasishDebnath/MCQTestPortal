import React, { useEffect, useState } from "react";
import { FaRegHourglassHalf, FaChartPie, FaFileLines } from "react-icons/fa6";
import { FaCamera, FaMicrophone, FaWifi } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function SystemCompatibility() {
  const { testid } = useParams();
  const navigate = useNavigate();
  
  const [cameraOk, setCameraOk] = useState(null);
  const [micOk, setMicOk] = useState(null);
  const [networkOk, setNetworkOk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraError, setCameraError] = useState("");
  const [micError, setMicError] = useState("");

  // CAMERA CHECK
  async function checkCamera() {
    console.log("🎥 Checking camera access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("✅ Camera access granted");
      setCameraOk(true);
      setCameraError("");
      // Stop the stream after checking
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("❌ Camera access failed:", error.name, error.message);
      setCameraOk(false);
      
      // Set user-friendly error messages
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please allow camera access.");

      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device.");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setCameraError("Camera is already in use by another application.");
      } else {
        setCameraError("Failed to access camera. Please check your device.");
      }
    }
  }

  // MICROPHONE CHECK
  async function checkMic() {
    console.log("🎤 Checking microphone access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Microphone access granted");
      setMicOk(true);
      setMicError("");
      // Stop the stream after checking
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("❌ Microphone access failed:", error.name, error.message);
      setMicOk(false);
      
      // Set user-friendly error messages
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setMicError("Microphone permission denied. Please allow microphone access.");

      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setMicError("No microphone found on this device.");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setMicError("Microphone is already in use by another application.");
      } else {
        setMicError("Failed to access microphone. Please check your device.");
      }
    }
  }

  // NETWORK CHECK
  async function checkNetwork() {
    console.log("🌐 Checking network stability...");
    const start = Date.now();
    try {
      await fetch("https://www.google.com/generate_204", { mode: "no-cors" });
      const latency = Date.now() - start;
      console.log(`✅ Network check completed in ${latency}ms`);
      setNetworkOk(latency < 1000);
      if (latency >= 1000) {

      }
    } catch (error) {
      console.error("❌ Network check failed:", error);
      setNetworkOk(false);

    }
  }

  useEffect(() => {
    console.log("🚀 Starting system compatibility checks...");
    setLoading(true);

    async function runChecks() {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("❌ Browser doesn't support getUserMedia");

        setCameraOk(false);
        setMicOk(false);
        setLoading(false);
        return;
      }

      await checkCamera();
      await checkMic();
      await checkNetwork();
      setLoading(false);
      console.log("✅ All compatibility checks completed");
    }

    runChecks();
  }, []);

  // Request full screen and navigate to instruction
  const handleProceed = () => {
    console.log("🚀 Proceeding to instructions...");
    if (cameraOk && micOk && networkOk) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
          .then(() => {
            console.log("✅ Fullscreen activated");
            navigate(`/instruction/${testid}`);
          })
          .catch((err) => {
            console.error("❌ Fullscreen failed:", err);
            toast.error("Fullscreen mode failed, but proceeding anyway");
            navigate(`/instruction/${testid}`);
          });
      } else {
        console.log("ℹ️ Fullscreen not supported");
        navigate(`/instruction/${testid}`);
      }
    } else {
      toast.error("Please ensure all system checks pass before proceeding");
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
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCamera className="" />
                    Camera access
                  </div>
                  <StatusIcon status={cameraOk} />
                </div>
                {cameraError && (
                  <p className="text-red-500 text-sm mt-1 ml-8">{cameraError}</p>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaMicrophone className="" />
                    Microphone access
                  </div>
                  <StatusIcon status={micOk} />
                </div>
                {micError && (
                  <p className="text-red-500 text-sm mt-1 ml-8">{micError}</p>
                )}
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
                  ? "bg-blue-theme cursor-pointer hover:bg-blue-600"
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
