import React, { useState } from "react";

export default function Instruction() {
  const [checked, setChecked] = useState(false);

  const handleStart = () => {
    if (!checked) {
      alert("Please agree to the instructions before starting the test.");
      return;
    }

    window.location.href = "/test";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-[#313d55] bg-blend-overlay relative m-0 p-0 pt-12"
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
        <div className="bg-blue-50 poppins p-5 rounded-xl mt-8 flex items-center gap-3">
          <input
            type="checkbox"
            className="w-5 h-5"
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
            className="bg-[#0E2258] text-white poppins px-10 py-1.5 rounded-full text-lg font-semibold hover:bg-blue-900 transition"
          >
            Start Test
          </button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <p className="text-sm text-slate-300 poppins absolute bottom-8 left-8">
        © IEM-UEM Group. All Rights Reserved.
      </p>

      {/* ===== HELP BUTTON ===== */}
      <button className="text-sm text-slate-300 poppins absolute bottom-8 right-8 text-center">
        Need Help?
      </button>
    </div>
  );
}
