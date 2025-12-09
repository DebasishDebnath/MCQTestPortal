import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FilePlus, Settings, FolderOpen } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/create-test", label: "Create Test", icon: FilePlus },
    { path: "/admin/all-test", label: "All Tests", icon: FolderOpen },
  ];

  return (
    <div
      className="w-[250px] h-full flex flex-col flex-shrink-0"
      style={{ backgroundColor: "#0E2258" }}
    >
      <div className="h-px mx-4 bg-indigo-400"></div>
      <nav className="flex-1 px-4 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/admin/all-test"
              ? activePath.startsWith(item.path) ||
                activePath.includes("/student-analytics")
              : activePath.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors  ${
                isActive
                  ? "bg-indigo-400 bg-opacity-20 text-white border-indigo-400"
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
  );
}

export default Sidebar;
