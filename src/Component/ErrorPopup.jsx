import React from "react";
import Lottie from "lottie-react";
import errorAnimation from "../../public/error.json";

export default function ErrorPopup({ message, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                    backdrop-blur-sm z-50 p-4 sm:p-6 lg:p-10 poppins"
    >
      <div
        className="relative backdrop-blur-2xl border border-white/30 bg-white  
                      rounded-3xl p-6 sm:p-8 lg:p-10 
                      flex flex-col items-center 
                      w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        {/* Animation scales with screen size */}
        <Lottie
          animationData={errorAnimation}
          loop={false}
          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
        />

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mt-4">
          Error
        </h2>

        <p className="text-black mt-2 text-center leading-relaxed text-sm sm:text-base lg:text-lg">
          {message}
        </p>

        <button
          onClick={onClose}
          className="mt-6 bg-red-500/90 text-white px-6 sm:px-8 py-2.5 rounded-full font-semibold
                     hover:bg-red-600 shadow-md hover:shadow-lg active:scale-95 transition-all
                     text-sm sm:text-base cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
