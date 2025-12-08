import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { initTF } from "../components/user/SetupTensorflow";
import { useHttp } from "./useHttp";

export function useProctoring(testid, isEnabled = true, autoStart = true) {
  const navigate = useNavigate();
  const { post } = useHttp();

  const [warningCount, setWarningCount] = useState(0);
  const [isExamActive, setIsExamActive] = useState(true);
  const [isProctoringReady, setIsProctoringReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const videoRef = useRef(null);
  const faceModelRef = useRef(null);
  const objectModelRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const lastWarn = useRef({});
  const warningCounts = useRef({}); // Track per-event warnings

  const PHONE_CLASSES = ["cell phone", "mobile phone", "smartphone"];
  const PHONE_MIN_CONF = 0.50;

  // --- Add this helper ---
  const reportProctorEvent = async (type, severity) => {
    if (!testid) return;
    try {
      await post(
        "/api/attempts/proctor",
        {
          examId: testid,
          proctorEvent: { type, severity },
        },
        {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
      );
    } catch (e) {
      // Silent fail
    }
  };

  useEffect(() => {
    if (!isEnabled) return setIsInitializing(false);
    let alive = true;

    async function initProctoring() {
      try {
        // ✅ Create hidden video element if not attached
        if (!videoRef.current) {
          const video = document.createElement("video");
          video.id = "proctor-video-hidden";
          video.width = 1280;
          video.height = 720;
          video.style.cssText = `
            width: 1px;
            height: 1px;
            opacity: 0;
            position: absolute;
            top: -9999px;
            left: -9999px;
            pointer-events: none;
          `;
          document.body.appendChild(video);
          videoRef.current = video;
          console.log("✅ Created hidden video element");
        }

        await initTF();

        // ✅ Check if permission was already granted in SystemCompatibility
        const cachedPermission = sessionStorage.getItem(`mediaStream_${testid}`);
        if (!cachedPermission) {
          console.warn("⚠️ No cached permission found. Requesting fresh stream...");
        } else {
          console.log("✅ Using cached camera/mic permission");
        }

        // Request camera + mic (will succeed quickly if already allowed)
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 1280, height: 720 },
            audio: true,
          });
          console.log("✅ Stream acquired successfully");
        } catch (permErr) {
          console.error("❌ Permission still blocked:", permErr.name);
          throw permErr;
        }

        // ✅ Verify videoRef exists before setting srcObject
        if (!videoRef.current) {
          throw new Error("Video element is null");
        }

        // VIDEO SETUP (mobile safe)
        if (!alive) return;
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.muted = true;
        console.log("✅ Stream attached to video element");

        await new Promise((res, rej) => {
          const timeout = setTimeout(
            () => rej(new Error("Video metadata timeout")),
            5000
          );
          videoRef.current.onloadedmetadata = () => {
            clearTimeout(timeout);
            res();
          };
        });

        const playPromise = videoRef.current.play();
        if (playPromise) {
          await playPromise.catch((e) => {
            console.warn("⚠ Video play warning:", e);
          });
        }

        console.log("✅ Video playing successfully");

        // Load models
        if (!alive) return;
        faceModelRef.current = await blazeface.load();
        console.log("✅ Face model loaded");

        objectModelRef.current = await cocoSsd.load();
        console.log("✅ Object model loaded");

        if (!alive) return;
        setIsProctoringReady(true);
        setIsInitializing(false);

        window.dispatchEvent(new Event("proctoringReady"));

        if (autoStart) startMonitoring();
      } catch (err) {
        console.error("Proctoring Init Error:", err.message || err);

        // Better error message
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          toast.error(
            "❌ Camera/Mic permission required. Please enable in browser settings.",
            { duration: 5000 }
          );
        } else if (
          err.name === "NotFoundError" ||
          err.name === "DevicesNotFoundError"
        ) {
          toast.error("❌ No camera/microphone found on this device.", {
            duration: 5000,
          });
        } else {
          toast.error("⚠ Failed to initialize proctoring. Check device.", {
            duration: 5000,
          });
        }

        setIsInitializing(false);

        setTimeout(() => {
          navigate(`/instruction/${testid}`, { replace: true });
        }, 2500);
      }
    }

    initProctoring();

    return () => {
      alive = false;
      stopMonitoring();
      stopCamera();

      // ✅ Cleanup: Remove hidden video element
      if (videoRef.current && videoRef.current.parentNode) {
        videoRef.current.parentNode.removeChild(videoRef.current);
        videoRef.current = null;
      }
    };
  }, [testid, navigate, isEnabled, autoStart]);

  const warn = (msg, key) => {
    const now = Date.now();
    if (lastWarn.current[key] && now - lastWarn.current[key] < 4000) return;
    lastWarn.current[key] = now;

    // Escalate severity
    warningCounts.current[key] = (warningCounts.current[key] || 0) + 1;
    const count = warningCounts.current[key];
    const severity = count < 3 ? "warning" : "critical";
    reportProctorEvent(key, severity);

    // Show toast on top-right
    toast.error(msg, { duration: 3500, position: "top-right" });

    setWarningCount((prev) => {
      const c = prev + 1;
      if (c >= 3) autoSubmit("🚫 Multiple Malpractice Violations!");
      return c;
    });
  };

  const detectCheating = async () => {
    if (!isProctoringReady || !videoRef.current) return;

    try {
      // Face Detection
      const faces = await faceModelRef.current.estimateFaces(
        videoRef.current,
        false
      );

      if (!faces.length) return warn("⚠ Face not visible!", "no_face");

      if (faces.length > 1) return warn("🚫 Multiple faces detected!", "multi_face");

      // Suspicious Object Detection
      const objects = await objectModelRef.current.detect(videoRef.current);

      const foundPhone = objects.some(
        (d) => PHONE_CLASSES.includes(d.class) && d.score >= PHONE_MIN_CONF
      );

      if (foundPhone) return warn("🚫 Phone detected!", "phone");
    } catch (e) {
      console.warn("Detection Error:", e);
    }
  };

  const startMonitoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(detectCheating, 1800);
    console.log("🔍 Monitoring started");
  };

  const stopMonitoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const autoSubmit = (reason) => {
    setIsExamActive(false);
    stopMonitoring();
    stopCamera();

    window.dispatchEvent(
      new CustomEvent("autoSubmitExam", {
        detail: { reason, warnings: 3 },
      })
    );
  };

  // Tab + Focus
  useEffect(() => {
    if (!isProctoringReady) return;
    const onBlur = () => warn("⚠ Tab switch detected!", "blur");
    const onHide = () =>
      document.hidden && warn("⚠ Focus lost!", "visibility");

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [isProctoringReady]);

  // Fullscreen
  useEffect(() => {
    if (!isProctoringReady) return;
    const exitFS = () =>
      !document.fullscreenElement &&
      warn("⚠ Fullscreen exited!", "fs_exit");

    document.addEventListener("fullscreenchange", exitFS);
    return () =>
      document.removeEventListener("fullscreenchange", exitFS);
  }, [isProctoringReady]);

  return {
    videoRef,
    warningCount,
    isProctoringReady,
    isInitializing,
    isExamActive,
    startMonitoring,
  };
}
