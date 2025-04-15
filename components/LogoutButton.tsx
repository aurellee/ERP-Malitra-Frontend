"use client";

import { useAuth } from "@/app/context/AuthContext";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout, isAuthorized, userData } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("User logged out!");
  };

  return (
    <div className="p-0">
      {isAuthorized ? (
        <button
          onClick={handleLogout}
          // The styling below makes it look like a sidebar item:
          className="
            group flex items-center gap-2 rounded-md 
            text-gray-200 hover:text-white
            hover:bg-gray-700
            transition-colors w-full flex flex-1
          "
        >
          <LogOut
            size={20}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
          <span className="text-sm font-medium w-[180px] flex flex-1">Log out</span>
        </button>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}