import React from "react";

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmButtonText = "Confirm",
  isLoading = false,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="flex h-screen w-full fixed top-0 left-0 justify-center items-center z-50 backdrop-blur-sm bg-black/40 poppins"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-16 text-center flex flex-col items-center justify-center gap-10 max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-blue-theme font-semibold text-2xl">{title}</h2>
        <div className="flex justify-center gap-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-red-500 border border-red-500 text-red-500 hover:text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-40 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-blue-theme text-white font-medium py-2 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors min-w-40 disabled:bg-gray-400 cursor-pointer"
          >
            {isLoading ? "Loading..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
