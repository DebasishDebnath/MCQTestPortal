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
  const [streamRef, setStreamRef] = useState(null);

  // COMBINED CAMERA + MIC CHECK (single permission request)
  async function checkCameraAndMic() {
    console.log("🎥🎤 Checking camera + microphone access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: true 
      });
      
      console.log("✅ Camera + Microphone access granted");
      
      // Check if we actually got video and audio tracks
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      if (videoTracks.length > 0) {
        setCameraOk(true);
        setCameraError("");
      } else {
        setCameraOk(false);
        setCameraError("Camera track not available");
      }
      
      if (audioTracks.length > 0) {
        setMicOk(true);
        setMicError("");
      } else {
        setMicOk(false);
        setMicError("Microphone track not available");
      }
      
      // ✅ Store stream in sessionStorage to reuse in TestQuestion
      sessionStorage.setItem(`mediaStream_${testid}`, JSON.stringify({
        timestamp: Date.now(),
        hasVideo: videoTracks.length > 0,
        hasAudio: audioTracks.length > 0,
      }));
      console.log("💾 Stream permission cached in sessionStorage");
      
      // Store stream reference to reuse
      setStreamRef(stream);
      
    } catch (error) {
      console.error("❌ Camera/Mic access failed:", error.name, error.message);
      
      // Handle permission errors
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraError("Permission denied. Please allow camera access in browser settings.");
        setMicError("Permission denied. Please allow microphone access in browser settings.");
        setCameraOk(false);
        setMicOk(false);
        
        // Show helpful toast
        toast.error(
          "⚠️ Camera & Microphone Required:\n\n1. Click camera icon in address bar\n2. Select 'Allow' for both\n3. Refresh page",
          { duration: 8000 }
        );
        
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device.");
        setMicError("No microphone found on this device.");
        setCameraOk(false);
        setMicOk(false);
        
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setCameraError("Camera/Mic already in use by another application.");
        setMicError("Camera/Mic already in use by another application.");
        setCameraOk(false);
        setMicOk(false);
        
      } else {
        setCameraError("Failed to access camera. Check device settings.");
        setMicError("Failed to access microphone. Check device settings.");
        setCameraOk(false);
        setMicOk(false);
      }
    }
  }

  // NETWORK CHECK
  async function checkNetwork() {
    console.log("🌐 Checking network stability...");
    try {
      const start = Date.now();
      const response = await fetch("https://www.google.com/generate_204", { 
        mode: "no-cors",
        cache: "no-cache"
      });
      const latency = Date.now() - start;
      console.log(`✅ Network check completed in ${latency}ms`);
      setNetworkOk(true);
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
        setCameraError("Your browser doesn't support camera access");
        setMicError("Your browser doesn't support microphone access");
        setLoading(false);
        return;
      }

      // Run checks in sequence
      await checkCameraAndMic();
      await checkNetwork();
      
      setLoading(false);
      console.log("✅ All compatibility checks completed");
    }

    runChecks();

    // Cleanup: stop stream on unmount
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Request full screen and navigate to instruction
  const handleProceed = () => {
    console.log("🚀 Proceeding to instructions...");
    
    // ✅ Stop the test stream before navigation (proctoring will request fresh one)
    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
      setStreamRef(null);
    }
    
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
                  Performing compatibility tests...
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
              className={`w-full py-3 px-10 text-white rounded-full flex items-center justify-center gap-4 mt-10 font-semibold ${
                cameraOk && micOk && networkOk
                  ? "bg-blue-theme cursor-pointer hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleProceed}
            >
              Proceed to Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemCompatibility;
