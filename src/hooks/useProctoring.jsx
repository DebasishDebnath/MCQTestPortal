import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import { initTF } from "../components/user/SetupTensorflow";

export function useProctoring(testid, isEnabled = true, startMonitoring = true) {
  const navigate = useNavigate();
  const [warningCount, setWarningCount] = useState(0);
  const [isExamActive, setIsExamActive] = useState(true);
  const [isProctoringReady, setIsProctoringReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const videoRef = useRef(null);
  const faceModelRef = useRef(null);
  const objectModelRef = useRef(null);
  const monitoringIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const lastWarningRef = useRef({});  // Track last warning time for each type

  // 🎥 Initialize TensorFlow and Camera
  useEffect(() => {
    if (!isEnabled) {
      setIsInitializing(false);
      return;
    }

    let mounted = true;

    async function initializeProctoring() {
      try {
        // Initialize TensorFlow silently
        const tfReady = await initTF();
        if (!tfReady || !mounted) {
          setIsInitializing(false);
          return;
        }

        // Request camera access
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current && mounted) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
        }

        // Load AI models silently in background
        faceModelRef.current = await blazeface.load();
        objectModelRef.current = await cocoSsd.load();

        if (mounted) {
          setIsProctoringReady(true);
          setIsInitializing(false);
          
          // Dispatch event to start timer
          window.dispatchEvent(new CustomEvent("proctoringReady"));
          
          // Only start monitoring if explicitly enabled
          if (startMonitoring) {
            startMonitoringLoop();
          }
        }
      } catch (error) {
        console.error("Proctoring initialization error:", error);
        if (mounted) {
          toast.error("⚠️ Please allow camera access to continue the exam", {
            duration: 5000,
          });
          setIsInitializing(false);
          setTimeout(() => {
            navigate(`/instruction/${testid}`);
          }, 2000);
        }
      }
    }

    initializeProctoring();

    // Cleanup
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, [testid, navigate, isEnabled, startMonitoring]);

  // ⚠️ Warning System with Debouncing
  const raiseWarning = (msg, warningType) => {
    const now = Date.now();
    const lastWarning = lastWarningRef.current[warningType];

    // Prevent duplicate warnings within 5 seconds
    if (lastWarning && now - lastWarning < 5000) {
      return;
    }

    lastWarningRef.current[warningType] = now;

    toast.error(msg, { duration: 4000 });
    setWarningCount((prev) => {
      const count = prev + 1;
      console.log(`⚠️ Warning ${count}/3: ${msg}`);

      if (count >= 3) {
        autoSubmitExam("Multiple violations detected - Exam terminated");
      }
      return count;
    });
  };

  // 🔍 AI Monitoring Function
  const monitorCheating = async () => {
    if (!videoRef.current || !isExamActive || !isProctoringReady) return;

    try {
      // Face Detection
      const facePredictions = await faceModelRef.current.estimateFaces(
        videoRef.current,
        false
      );

      if (facePredictions.length === 0) {
        raiseWarning("⚠️ Face not visible! Please stay in front of camera.", "face_missing");
      } else if (facePredictions.length > 1) {
        raiseWarning("🚫 Multiple faces detected! Only you should be visible.", "multiple_faces");
      }

      // Object Detection
      const objectPredictions = await objectModelRef.current.detect(
        videoRef.current
      );
  
      const bannedItems = ["cell phone", "book", "laptop", "mouse", "keyboard"];
      const detectedBannedItems = objectPredictions.filter((obj) =>
        bannedItems.some((item) => obj.class.toLowerCase().includes(item))
      );

      if (detectedBannedItems.length > 0) {
        const items = detectedBannedItems.map((o) => o.class).join(", ");
        raiseWarning(`🚫 Suspicious item detected: ${items}`, "banned_item");
      }
    } catch (error) {
      console.error("Monitoring error:", error);
    }
  };

  // ⏰ Start Monitoring Loop
  const startMonitoringLoop = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }
    monitoringIntervalRef.current = setInterval(monitorCheating, 3000);
  };

  // 🚫 Auto Submit on Violations
  const autoSubmitExam = async (reason) => {
    setIsExamActive(false);
    
    // Clear monitoring interval
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    toast.error(`🚫 ${reason}`, { duration: 5000 });
    
    // Trigger final submission event
    window.dispatchEvent(new CustomEvent("autoSubmitExam", { 
      detail: { reason, warningCount: 3 } 
    }));
  };

  // 🖱️ Tab Switch Detection
  useEffect(() => {
    if (!isEnabled || !isProctoringReady || !startMonitoring) return;

    const handleBlur = () => {
      if (isExamActive) {
        raiseWarning("⚠️ Tab/Window switched detected!", "tab_switch");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isExamActive) {
        raiseWarning("⚠️ Tab switched detected!", "visibility_change");
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isExamActive, isProctoringReady, isEnabled, startMonitoring]);

  // 🖥️ Fullscreen Detection
  useEffect(() => {
    if (!isEnabled || !isProctoringReady || !startMonitoring) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isExamActive) {
        raiseWarning("⚠️ Fullscreen mode exited!", "fullscreen_exit");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isExamActive, isProctoringReady, isEnabled, startMonitoring]);

  // ⌨️ Keyboard Restrictions
  useEffect(() => {
    if (!isEnabled || !isProctoringReady || !startMonitoring) return;

    const handleKeyDown = (e) => {
      // Prevent Escape
      if (e.key === "Escape") {
        e.preventDefault();
        raiseWarning("⚠️ Escape key is disabled during exam", "escape_key");
      }

      // Prevent F5 Refresh
      if (e.key === "F5") {
        e.preventDefault();
        raiseWarning("⚠️ Page refresh is disabled during exam", "f5_key");
      }

      // Prevent Ctrl+R (Refresh)
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        raiseWarning("⚠️ Page refresh is disabled during exam", "ctrl_r");
      }

      // Prevent Ctrl+C, Ctrl+V, Ctrl+X
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        raiseWarning("⚠️ Copy/Paste operations are disabled", "copy_paste");
      }

      // Prevent F12, Ctrl+Shift+I (DevTools)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
        raiseWarning("⚠️ Developer tools are disabled", "devtools");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExamActive, isProctoringReady, isEnabled, startMonitoring]);

  // 🖱️ Right Click Prevention
  useEffect(() => {
    if (!isEnabled || !isProctoringReady || !startMonitoring) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error("Right-click is disabled", { duration: 1000 });
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [isProctoringReady, isEnabled, startMonitoring]);

  return {
    videoRef,
    warningCount,
    isProctoringReady,
    isInitializing,
    isExamActive,
    startMonitoringLoop,
  };
}