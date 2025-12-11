import React, { useState, useEffect } from "react";
import { useHttp } from "../../hooks/useHttp.jsx";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import DotLoader from "../../components/common/DotsLoader.jsx"

function ForgetPassword() {
  const [step, setStep] = useState("verifyEmail"); // 'verifyEmail', 'verifyOtp', 'resetPassword'
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { post, loading, error } = useHttp();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred.");
    }
  }, [error]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateOtp = async () => {
    const data = await post("/api/superadmins/generate-forget-password-otp", {
      email: formData.email,
    });
    if (data && data.success) {
      toast.success("OTP sent to your email address.");
      setStep("verifyOtp");
    }
  };

  const handleVerifyOtp = async () => {
    const data = await post("/api/superadmins/verify-forget-password-otp", {
      email: formData.email,
      otp: formData.otp,
    });
    console.log(data);
    
    if (data && data.success) {
      localStorage.setItem("resetToken", data?.data.accessToken);
      toast.success("OTP verified successfully. You can now reset your password.");
      setStep("resetPassword");
    }
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("resetToken");
    if (!token) {
      toast.error("Session expired. Please start over.");
      setStep("verifyEmail");
      return;
    }

    const data = await post(
      "/api/superadmins/reset-password",
      { password: formData.newPassword },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (data && data.success) {
      localStorage.removeItem("resetToken");
      toast.success("Password has been reset successfully!");
      navigate("/admin/login");
    } else if (!data) {
      toast.error("Failed to reset password. Your token might have expired.");
    }
  };

  return (
    <div
      className="h-full flex bg-[#313d55] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white w-full pb-10 poppins"
      style={{
        backgroundImage: "url(/regbg.png)",
      }}
    >
      <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 justify-between poppins gap-6 items-start p-6">
          <h1 className="text-5xl font-medium leading-tight">Welcome to</h1>
          <h1 className="text-6xl font-semibold">MCQ Test Platform</h1>
          <p className="text-lg">with Proctoring and full screen mode</p>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-xl p-10">
            <h2 className="text-3xl font-semibold mb-8 mt-4">
              Forget Password
            </h2>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()} // Prevent default form submission
            >
              {step !== "resetPassword" && (
                <>
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                      Email <MdEmail className="w-4 h-4" />
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-full border-2 border-slate-200
                                    focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                        required
                        disabled={step !== "verifyEmail"}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateOtp}
                        className="min-w-32 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-full transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        disabled={step !== "verifyEmail" || loading}
                      >
                        {step === "verifyEmail"
                          ? loading
                            ? (
                              <span className="flex justify-center items-center w-full">
                                <DotLoader />
                              </span>
                            )
                            : "Verify"
                          : "Verified"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step !== "resetPassword" && (
                <>
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                      OTP <RiLockPasswordFill className="w-4 h-4" />
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 pr-12 rounded-full border-2 border-slate-200 
                                        focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                        required
                        disabled={step !== "verifyOtp"}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full transition-colors mt-6"
                    disabled={loading || formData.otp.length < 4}
                  >
                    {loading && step === "verifyOtp" ? (
                              <span className="flex justify-center items-center w-full">
                                <DotLoader />
                              </span>
                            ) : "Submit"}
                  </button>
                </>
              )}

              {step === "resetPassword" && (
                <>
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                      New Password <RiLockPasswordFill className="w-4 h-4" />
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 pr-12 rounded-full border-2 border-slate-200 
                                        focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-4 text-slate-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                      Confirm Password{" "}
                      <RiLockPasswordFill className="w-4 h-4" />
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 pr-12 rounded-full border-2 border-slate-200 
                                        focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 px-4 text-slate-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full transition-colors mt-6"
                    disabled={
                      loading ||
                      !formData.newPassword ||
                      formData.newPassword !== formData.confirmPassword
                    }
                  >
                    {loading ? (
                              <span className="flex justify-center items-center w-full">
                                <DotLoader />
                              </span>
                            ) : "Reset Password"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
