"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function LogoutButton() {
  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    logout();
    console.log("User logged out!");
  };

  return (
    <div className="p-4">
      {isAuthenticated ? (
        <>
          <p className="mb-2">Logged in as: {user?.userName}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
