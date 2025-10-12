import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const token = sessionStorage.getItem("token"); // ya cookie bhi use kar sakte ho
        // if (!token) return;

        const res = await axios.get("http://localhost:5000/me", {
          withCredentials: true,

        });
        console.log("res =>" , res  )
        setUser(res.data);
      } catch (err) {
        console.log("Not logged in:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
       await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ✅ Click outside to close menu
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center py-4 px-6 bg-white border-b border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Sheikh CryptoHub
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative" ref={menuRef}>
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-slideDown">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <hr />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-md"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
