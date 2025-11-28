import React, { useState, useEffect } from "react";
import { useHttp } from "../../hooks/useHttp.jsx";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Eye, EyeOff } from "lucide-react";
import ErrorPopup from "../../components/error/ErrorPopup.jsx";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { post, loading, error, errorStatus, extractRole } = useHttp();
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      navigate("/system-compatibility");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      password: formData.password,
      email: formData.email,
    };

    const result = await post("/api/superadmins/login", body);
    console.log("API response:", result);

    if (result && result.success && result.data && result.data.accessToken) {
      localStorage.setItem("userToken", result.data.accessToken);
      sessionStorage.setItem("userToken", result.data.accessToken);
      extractRole(); // <-- Extract and store role after setting token
      navigate("/admin/dashboard");
    } else if (errorStatus === 404) {
      setShowError(true);
    } else {
      setShowError(true);
    }
  };

  useEffect(() => {
    if (error && errorStatus === 404) {
      setShowError(true);
    }
  }, [error, errorStatus]);

  return (
    <>
      <div
        className="h-full flex bg-[#313d55] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white w-full pb-10 poppins"
        style={{
          backgroundImage: "url(/regbg.png)",
        }}
      >
        <div className="flex justify-center items-center max-w-[1440px] mx-auto w-full">
          {/* Left Section */}
          <div className="flex flex-col w-1/2 justify-between items-center poppins gap-6 items-start">
            <h1 className="text-5xl font-medium leading-tight">Welcome</h1>
            <h1 className="text-6xl font-semibold">Super Admin</h1>
            <p className="text-lg">Proceed to Log In </p>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
            <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-semibold mb-8 mt-4">Login</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                    Email <MdEmail className="w-4 h-4" />
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full border-2 border-slate-200 
                                    focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 ml-2">
                    Password <RiLockPasswordFill className="w-4 h-4" />
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-12 rounded-full border-2 border-slate-200 
                                        focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full transition-colors mt-6"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {showError && (
                  <ErrorPopup
                    message={error}
                    onClose={() => setShowError(false)}
                  />
                )}
              </form>

              <div className="text-center mt-6">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{" "}
                  <a
                    href="/admin/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Register
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
