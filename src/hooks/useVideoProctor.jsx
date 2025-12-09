import { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { useHttp } from "./useHttp";

export default function useVideoProctor(videoRef, onHard, onLog, testid) {
  const { post } = useHttp();
  const faceModelRef = useRef(null);
  const objModelRef = useRef(null);
  const detectIntervalRef = useRef(null); // ✅ For face detection
  const micIntervalRef = useRef(null); // ✅ Separate interval for mic
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const detectionActive = useRef(false);
  const hardWarnings = useRef(0);
  const warningCounts = useRef({});
  const lastWarn = useRef({}); // Debounce warnings

  const HARD_LIMIT = 3;
  const PHONE_CONFIDENCE = 0.40;
  const phoneClasses = ["cell phone", "mobile phone", "phone", "smartphone"];

  function log(msg) {
    console.log("[PROCTOR]", msg);
    onLog && onLog(msg);
  }

  async function reportProctorEvent(type, severity) {
    if (!testid) return;
    try {
      await post(
        "/api/attempts/proctor",
        {
          examId: testid,
          proctorEvent: { type, severity }
        },
        {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }
      );
    } catch (e) {
      log("Failed to report proctor event: " + e);
    }
  }

  function hard(reason) {
    // Debounce - prevent duplicate warnings within 3s
    const now = Date.now();
    if (lastWarn.current[reason] && now - lastWarn.current[reason] < 3000) return;
    lastWarn.current[reason] = now;

    hardWarnings.current++;
    log(`⚠️ Hard warning (${hardWarnings.current}/3): ${reason}`);

    warningCounts.current[reason] = (warningCounts.current[reason] || 0) + 1;
    const count = warningCounts.current[reason];
    const severity = count < 3 ? "warning" : "critical";
    reportProctorEvent(reason, severity);

    onHard && onHard(reason, hardWarnings.current);
    
    if (hardWarnings.current >= HARD_LIMIT) {
      stop();
      console.log("🚫 HARD LIMIT REACHED - Dispatching autoSubmitExam event");
      
      const event = new CustomEvent("autoSubmitExam", {
        detail: { reason: "Multiple proctoring violations detected!", warnings: 3 }
      });
      
      console.log("📤 Event created:", event);
      window.dispatchEvent(event);
      console.log("✅ Event dispatched successfully");
    }
  }

  async function initBackend() {
    try {
      await tf.ready();
      const backends = ["webgl", "wasm", "cpu"];
      for (const b of backends) {
        try {
          await tf.setBackend(b);
          await tf.ready();
          log(`TF backend: ${b}`);
          return;
        } catch {}
      }
    } catch (e) {
      log("Backend init failed");
    }
  }

  async function loadModels() {
    await initBackend();
    await tf.ready();

    if (!faceModelRef.current) {
      faceModelRef.current = await blazeface.load();
      log("Face model ✔");
    }
    if (!objModelRef.current) {
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      objModelRef.current = await cocoSsd.load({ base: "mobilenet_v2" });
      log("Object model ✔");
    }
  }

  async function detect() {
    const faceModel = faceModelRef.current;
    const objModel = objModelRef.current;
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    try {
      const faces = await faceModel.estimateFaces(video, false);

      if (!faces || faces.length === 0) return hard("No face detected");
      if (faces.length > 1) return hard("Multiple faces detected");

      const p = faces[0];
      const topLeft = p.topLeft;
      const bottomRight = p.bottomRight;
      const bboxW = bottomRight[0] - topLeft[0];
      const videoW = video.videoWidth;

      if (bboxW < videoW * 0.12) return hard("Face too small / too far");

      const lm = p.landmarks;
      const nose = lm[2];
      const centerX = (topLeft[0] + bottomRight[0]) / 2;
      const dx = Math.abs(nose[0] - centerX);
      if (dx > bboxW * 0.18) return hard("Looking away");

      let objs = [];
      try {
        objs = await objModel.detect(video);
      } catch {
        return;
      }

      if (objs.some(o => phoneClasses.includes(o.class) && o.score >= PHONE_CONFIDENCE)) {
        return hard("Phone detected");
      }

      log("Face OK");
    } catch (e) {
      console.error("Detection error:", e);
    }
  }

  async function startMicrophoneTest() {
    try {
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      monitorMicVolume();
      log("Microphone test ON");
    } catch (e) {
      log("Microphone access failed");
    }
  }

  function getVolumeDb() {
    if (!analyserRef.current) return 0;
    const buffer = new Uint8Array(analyserRef.current.fftSize);
    analyserRef.current.getByteTimeDomainData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const val = (buffer[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / buffer.length);
    const db = 20 * Math.log10(rms);
    const dbSpl = Math.round(60 + db * 20);
    return dbSpl;
  }

  function monitorMicVolume() {
    let loudCount = 0;
    const check = () => {
      const db = getVolumeDb();
      if (db >= 80) {
        loudCount++;
        if (loudCount >= 3) {
          hard("Microphone: Shouting detected");
          loudCount = 0;
        }
      } else if (db >= 66) {
        hard("Microphone: Loud talking detected");
        loudCount = 0;
      } else {
        loudCount = 0;
      }
    };
    // ✅ Use separate interval ref
    micIntervalRef.current = setInterval(check, 1200);
  }

  // ✅ ADD TAB SWITCH & FULLSCREEN MONITORING
  function setupBrowserMonitoring() {
    const onBlur = () => hard("Tab switch detected");
    const onHide = () => document.hidden && hard("Focus lost");
    const exitFS = () => !document.fullscreenElement && hard("Fullscreen exited");

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onHide);
    document.addEventListener("fullscreenchange", exitFS);

    log("Browser monitoring ON");

    // Return cleanup function
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onHide);
      document.removeEventListener("fullscreenchange", exitFS);
    };
  }

  async function start(videoConstraints = { width: 1280, height: 720 }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", ...videoConstraints },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      await loadModels();

      detectionActive.current = true;
      // ✅ Start face detection interval
      detectIntervalRef.current = setInterval(detect, 1200);

      await startMicrophoneTest();

      // ✅ Start browser monitoring
      const cleanupBrowser = setupBrowserMonitoring();
      
      // Store cleanup function
      videoRef.cleanupBrowser = cleanupBrowser;

      log("Camera + Detection + Browser Monitoring ON");
      return true;
    } catch (e) {
      log("Camera failed: " + e);
      return false;
    }
  }

  function stop() {
    detectionActive.current = false;
    
    // ✅ Clear both intervals
    if (detectIntervalRef.current) {
      clearInterval(detectIntervalRef.current);
      detectIntervalRef.current = null;
    }
    if (micIntervalRef.current) {
      clearInterval(micIntervalRef.current);
      micIntervalRef.current = null;
    }

    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // ✅ Cleanup browser monitoring
    if (videoRef.cleanupBrowser) {
      videoRef.cleanupBrowser();
      videoRef.cleanupBrowser = null;
    }

    log("Stopped");
  }

  useEffect(() => stop, []);

  return { start, stop };
}