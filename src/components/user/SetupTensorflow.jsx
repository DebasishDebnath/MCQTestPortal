import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export async function initTF() {
  try {
    await tf.setBackend("webgl");
    await tf.ready();
    console.log("✅ TensorFlow WebGL backend activated");
    return true;
  } catch (error) {
    console.error("❌ TensorFlow initialization failed:", error);
    return false;
  }
}