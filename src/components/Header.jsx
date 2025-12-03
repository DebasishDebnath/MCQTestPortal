import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleDot, FaRegHourglassHalf } from "react-icons/fa6";
import iem from "/iem.png";
import uem from "/uem.png";
import { User } from "lucide-react";
import { useHttp } from "../hooks/useHttp.jsx";


function Header() {
    const { get } = useHttp();
  const location = useLocation();
  const navigate = useNavigate();
  const isTestPage = location.pathname.includes("/test/");
  const isDashboard = location.pathname === "/dashboard";

  // Initialize with null to show loading state
  const [firstName, setFirstName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      get("/api/users/profile", { Authorization: `Bearer ${token}` })
        .then((data) => {
          if (data && data.data) {
            const name = data.data.name || "User";
            const image = data.data.profileImage || null;
            
            localStorage.setItem("firstName", name);
            setFirstName(name);
            
            if (image) {
              localStorage.setItem("Image", image);
              setProfilePic(image);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
          // Fallback to localStorage if API fails
          setFirstName(localStorage.getItem("firstName") || "User");
          setProfilePic(localStorage.getItem("Image") || null);
        });
    } else {
      // No token, use localStorage values
      setFirstName(localStorage.getItem("firstName") || "User");
      setProfilePic(localStorage.getItem("Image") || null);
    }
  }, [get, location.pathname]);

  return (
    <header className="bg-blue-theme w-full poppins">
      <div className="text-white px-6 flex justify-between items-center max-w-[1440px] mx-auto">
        <div className="flex items-start">
          <img src={iem} alt="" className=" w-22" />
          <img src={uem} alt="" className=" w-22" />
        </div>
        {isTestPage ? (
          <div className="flex justify-center items-center gap-3 text-sm">
            <FaRegHourglassHalf size={16} /> 10:46{" "}
            <FaRegCircleDot className="text-red-600" size={16} />
          </div>
        ) : isDashboard ? (
          <div className="absolute top-4 right-4 flex items-end gap-4">
  {profilePic ? (
    <img
      src={profilePic}
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover border"
      onError={(e) => {
        console.error("Image load error:", profilePic);
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  ) : null}
  <div className={`w-10 h-10 rounded-full bg-gray-300 items-center justify-center border ${profilePic ? 'hidden' : 'flex'}`}>
    <User size={20} className="text-gray-600" />
  </div>
  <span className="font-semibold text-white">{firstName || "User"}</span>
  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors hover:shadow-lg hover:scale-105 hover:cursor-pointer"
  >
    Logout
  </button>
</div>

        ) : (
          <div></div>
        )}
        {isTestPage ? (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openFinalSubmission'))}
            className="cursor-pointer w-fit py-1.5 px-6 bg-red-700 text-white rounded-full flex items-center justify-center gap-4 text-sm font-medium ml-10"
          >
            Finish Test
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
}

export default Header;
