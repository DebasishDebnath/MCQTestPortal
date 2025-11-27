import React from "react";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isTestPage = location.pathname.includes("/test/");
  
  return (
    <footer className={`absolute bottom-0 w-full ${isTestPage ? "bg-blue-theme" : ""}`}>
      <div className="text-white p-6 flex justify-between items-center max-w-[1440px] mx-auto">
        <p>© IEM - UEM Group. All Rights Reserved.</p>
        <p>Need Help?</p>
      </div>
    </footer>
  );
}

export default Footer;
