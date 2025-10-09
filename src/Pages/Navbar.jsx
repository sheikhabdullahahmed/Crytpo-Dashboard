import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import DarkMode from "./DarkMode";
import axios from "axios";


export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 🌙 Dark Mode Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    darkMode ? root.classList.add("dark") : root.classList.remove("dark");

    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [darkMode, menuOpen]);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

      // Local data remove
      // localStorage.removeItem("user");

      // Navigate to login
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-900 dark:text-white shadow">
      <p className="text-2xl font-bold uppercase tracking-wide">
        Sheikh CryptoHub
      </p>

      <div className="flex items-center md:mx-9 gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl hover:text-yellow-500"
        >
          <DarkMode />
        </button>

        {/* 👤 User Avatar / Login Button */}
        <div className="relative dropdown-wrapper" ref={menuRef}>
          {user ? (
            <>
              <button
                className="text-3xl md:mx-7 text-gray-700 dark:text-white flex items-center gap-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {user.email ? (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                ) : (
                  <FaUserCircle />
                )}
              </button>

              {menuOpen && (
                <div className="absolute md:my-4 right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/user/profile");
                    }}
                    className="w-full text-left px-4 py-2 dark:hover:bg-gray-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </button>
                  <hr className="my-1 dark:border-gray-600" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
