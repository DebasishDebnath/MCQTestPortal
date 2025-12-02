import React, { useState } from "react";
import { LayoutDashboard, FileText, Settings, Sigma } from "lucide-react";
import Dashboard from "../../Page/admin/Dashboard";
import TestDetails from "../../Page/admin/TestDetails";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "test-details", label: "Test Details", icon: FileText },
    { id: "all-test", label: "All Tests", icon: Sigma },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen ">
      <div
        className="w-[15%] h-full flex flex-col "
        style={{ backgroundColor: "#0E2258" }}
      >
        <div className="p-[0.2px] ml-[8%] mr-[8%] bg-[#999999]"></div>
        <nav className="flex-1 px-4 mt-[10%]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors  ${
                  activeItem === item.id
                    ? "bg-[#5C7CD4] bg-opacity-20 text-white border-[#5C7CD4]"
                    : "text-gray-300 hover:bg-[#5c7cd427] hover:bg-opacity-10 "
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex h-screen w-full">
        {activeItem === "dashboard" && <Dashboard />}
        {activeItem === "test-details" && <TestDetails />}
        {activeItem === "all-test" && <AllTest />}
        {/* {activeItem === "settings" && <SettingsPage />} */}
      </div>
    </div>
  );
}

export default Sidebar;
