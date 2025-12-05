import { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

export default function useVideoProctor(videoRef, onHard, onLog) {
  const faceModelRef = useRef(null);
  const objModelRef = useRef(null);
  const detectIntervalRef = useRef(null);

  const detectionActive = useRef(false);
  const hardWarnings = useRef(0);

  const HARD_LIMIT = 3;
  const PHONE_CONFIDENCE = 0.40;

  const phoneClasses = ["cell phone", "mobile phone", "phone", "smartphone"];

  function log(msg) {
    console.log("[PROCTOR]", msg);
    onLog && onLog(msg);
  }

  function hard(reason) {
    hardWarnings.current++;
    log(`⚠️ Hard warning (${hardWarnings.current}): ${reason}`);
    onHard && onHard(reason, hardWarnings.current);
    if (hardWarnings.current >= HARD_LIMIT) {
      stop();
      log("🚫 Exam cancelled");
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
      detectIntervalRef.current = setInterval(detect, 1200);

      log("Camera + Detection ON");
      return true;
    } catch (e) {
      log("Camera failed");
      return false;
    }
  }

  function stop() {
    detectionActive.current = false;
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);

    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    log("Stopped");
  }

  useEffect(() => stop, []);

  return { start, stop };
}