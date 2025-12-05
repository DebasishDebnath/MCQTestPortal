import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useHttp } from "../../hooks/useHttp";

export default function Instruction() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { testid } = useParams();
  const { get, loading } = useHttp();

  const handleStart = async () => {
    if (!checked) {
      toast.error("Please agree to the instructions before starting the test.");
      return;
    }

    const token = localStorage.getItem("userToken");
    console.log("🔑 Token exists:", !!token);
    console.log("🔑 Token preview:", token ? token.substring(0, 20) + "..." : "null");

    if (!token) {
      toast.error("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    try {
      console.log(`📡 Calling API: /api/questions/all/${testid}?page=1&limit=10`);
      console.log("📋 Test ID:", testid);

      const response = await get(`/api/questions/all/${testid}?page=1&limit=10`, {
        Authorization: `Bearer ${token}`,
      });

      console.log("✅ API Response:", response);
      console.log("📊 Response data:", response?.data);

      if (!response || !response.data) {
        toast.error("Failed to load questions. Please try again.");
        return;
      }

      // ✅ STORE DURATION IN LOCALSTORAGE
      const durationMinutes = response.data.durationMinutes || 120;
      localStorage.setItem(`examDuration_${testid}`, durationMinutes.toString());
      console.log("💾 Stored duration:", durationMinutes);

      const elem = document.documentElement;
      if (elem.requestFullscreen && !document.fullscreenElement) {
        elem.requestFullscreen()
          .then(() => {
            navigate(`/test-page/${testid}`, {
              state: {
                initialQuestions: response.data.questions,
                totalQuestions: response.data.totalQuestions,
                durationMinutes: durationMinutes,
                currentPage: 1,
              },
            });
          })
          .catch((err) => {
            console.error("❌ Fullscreen error:", err);

            navigate(`/test-page/${testid}`, {
              state: {
                initialQuestions: response.data.questions,
                totalQuestions: response.data.totalQuestions,
                durationMinutes: durationMinutes,
                currentPage: 1,
              },
            });
          });
      } else {
        navigate(`/test-page/${testid}`, {
          state: {
            initialQuestions: response.data.questions,
            totalQuestions: response.data.totalQuestions,
            durationMinutes: durationMinutes,
            currentPage: 1,
          },
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error(`Error: ${error.message || "Failed to load questions"}`);
    }
  };

  return (
    <div
      className=" h-full  bg-cover bg-center bg-no-repeat bg-[#313d55] bg-blend-overlay relative m-0 p-0 pt-12 poppins"
      style={{ backgroundImage: "url('/regbg.png')" }}
    >
      {/* ===== PAGE TITLE ===== */}
      <h1 className="text-center text-4xl poppins-semibold text-white ">
        Instructions
      </h1>

      {/* ===== WHITE INSTRUCTION CARD ===== */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl mt-8 p-10 border border-gray-300">

        <h2 className="text-xl poppins-semibold mb-5 text-gray-800">
          Read the following instructions carefully
        </h2>
        <ul className="list-disc pl-6 poppins space text-gray-700 text-lg">
          <li>
            <strong>Full Screen Mode:</strong>
            <br />
            The test will be conducted in full-screen mode. Exiting full-screen
            will be recorded as a violation.
          </li>

          <li>
            <strong>Proctoring Active:</strong>
            <br />
            Your video and audio are being recorded. Ensure your face is visible
            at all times.
          </li>

          <li>
            <strong>Navigation:</strong>
            <br />
            Do not switch tabs or minimize the browser window.
          </li>

          <li>
            <strong>Malpractice:</strong>
            <br />
            Use of external devices or another person in the room will lead to
            disqualification.
          </li>
        </ul>

        {/* ===== CHECKBOX ===== */}
        <div className="bg-blue-50 poppins p-5 rounded-xl mt-8 flex items-center gap-3 ">
          <input
            type="checkbox"
            className="w-5 h-5 cursor-pointer"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
          <span className="text-gray-700 font-medium">
            I have read and understood the instructions
          </span>
        </div>

        {/* ===== START BUTTON ===== */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-blue-theme text-white poppins px-10 py-1.5 rounded-full text-lg font-semibold hover:bg-blue-900 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Start Test"}
          </button>
        </div>
      </div>
    </div>
  );
}