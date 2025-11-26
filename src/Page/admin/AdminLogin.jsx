import React, { useState } from "react";
import { useHttp } from "../../hooks/useHttp.jsx"; // Import the hook

export default function LoginPage() {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const { post, loading, error } = useHttp();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Map formData to API body
        const body = {
            password: formData.password,
            email: formData.email,
        };
        const result = await post("/api/users/login", body);
        console.log("API response:", result);
        // Optionally handle success/error here
    };

    return (
        <>

            {/* Full Page Background */}
            <div
                className="min-h-screen flex bg-[#313d55] bg-cover bg-center bg-no-repeat bg-blend-overlay text-white"
                style={{
                    backgroundImage: "url(/regbg.png)",
                }}
            >
                {/* Left Section */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between items center p-18">
                    <div className=" items-center p-20">
                        <h1 className="text-6xl font-bold mb-4 leading-tight poppins-regular">
                            Welcome to
                        </h1>
                        <h1 className="text-6xl font-bold mb-4 leading-tight poppins-bold mt-10">
                            Super Admin MCQ Test Platform
                        </h1>
                        <p className="poppins-medium mt-9 text-base">with Proctoring and full screen mode</p>
                    </div>

                    <footer className="text-sm text-slate-300 mt-6">
                        © IEM - UEM Group. All Rights Reserved.
                    </footer>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                    {/* Help Button */}
                    <div className="absolute top-8 right-8">
                        <button className="text-sm text-slate-200 hover:text-white font-medium">
                            Need Help?
                        </button>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold mb-8">Login</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-full border-2 border-slate-200 focus:border-blue-500 focus:outline-none placeholder-slate-400 transition-colors"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-full transition-colors mt-8"
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register Now"}
                            </button>
                            {error && (
                                <div className="text-red-500 text-sm mt-2">{error}</div>
                            )}
                        </form>

                        {/* Login */}
                        <div className="text-center mt-6">
                            <p className="text-slate-600 text-sm">
                                Don't have an account?{" "}
                                <a
                                    href="/register"
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Register
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
