import React, { useEffect, useRef, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { FaBars, FaStar, FaTimes, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { persistor } from "../store/store";
import { clearWatchlist } from "../features/watchlistSlice"; 


export default function Navbar() {

const dispatch = useDispatch();
 const watchlist = useSelector((state) => state.watchlist.items);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/emaildata", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.log("Not logged in");
      }
    };
    fetchUser();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
  try {
    // Backend logout
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

    // Redux + Persist clear
    dispatch(clearWatchlist());
    await persistor.purge();

    // UI updates
    setUser(null);
    toast.success("Logged out successfully!", { position: "top-right" });
    navigate("/login");
    setMenuOpen(false);
    setUserMenuOpen(false);
  } catch (err) {
    toast.error("Logout failed!", { position: "top-right" });
  }
};


  // ✅ Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 flex justify-between items-center py-4 px-4 md:py-6 md:px-10 bg-white border-b border-gray-200 shadow-sm">
        {/* Left Side: Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
        >
          Sheikh CryptoHub
        </h1>

        {/* Mobile Right Side: Watchlist + Hamburger */}
        <div className="md:hidden cursor-pointer flex items-center gap-3">
          {/* Mobile Watchlist Button */}
          <button
            onClick={() => {
              navigate("/watch");
              setMenuOpen(false);
            }}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Watchlist"
          >
           <FaStar className="text-gray-500 group-hover:text-yellow-400 text-2xl transition-all duration-300" />
        {watchlist.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
            {watchlist.length}
          </span>)}
          </button>

          {/* Hamburger Icon */}
          <button
            className="text-gray-700 text-2xl cursor-pointer focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Middle: Nav Links (Desktop + Mobile Menu) */}
        <nav
          ref={menuRef}
          className={`fixed md:static top-[73px] left-0 w-full md:w-auto bg-white md:bg-transparent 
          flex flex-col md:flex-row items-center gap-4 md:gap-8 py-6 md:py-0 
          transition-all duration-300 ease-in-out 
          ${
            menuOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"
          }
          md:opacity-100 md:translate-x-0 shadow-lg md:shadow-none border-b md:border-0 border-gray-200`}
        >
          {["Portfolio", "news", "Publications", "roadmap"].map(
            (item) => (
              <NavLink
                key={item}
                to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-semibold transition-colors duration-200 px-4 md:px-0 py-2 md:py-0 w-full md:w-auto text-center md:text-left ${
                    isActive
                      ? "text-blue-600 bg-blue-50 md:bg-transparent"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 md:hover:bg-transparent"
                  }`
                }
              >
                {item}
              </NavLink>
            )
          )}

          {/* Mobile Only: User Section in Menu */}
          <div className="md:hidden w-full border-t border-gray-200 pt-4 px-4">
            {user ? (
              <div className="space-y-3">
                {/* User Info Card */}
               

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }} 
                className="w-full  bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <FaUser />
                <span>Login / Sign Up</span>
              </button>
            )}
          </div>
        </nav>

        {/* Right Side: Watchlist + User (Desktop Only) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Desktop Watchlist Button */}
          <button
            onClick={() => navigate("/watch")}
            className="relative cursor-pointer group flex items-center gap-2 hover:text-yellow-500 transition-all duration-300"
            title="Watchlist"
          >
           <div className="relative ">
            <FaStar className="text-gray-500 group-hover:text-yellow-400 text-2xl transition-all duration-300" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                {watchlist.length}
              </span>
            )}
          </div>
            <span className="text-gray-600  group-hover:text-yellow-500 font-medium">
              Watchlist
            </span>
          </button>

          {/* Desktop User Avatar / Login */}
          {user ? (
            <div className="relative " ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-14 w-64  bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out animate-slideDown">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 cursor-pointer rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                        {user.email ? user.email[0].toUpperCase() : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">Account</p>
                      </div>
                    </div>

                    <div className="bg-white px-3 py-2 rounded-md border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">
                        User ID
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-mono truncate flex-1">
                          {user._id}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(user._id);
                            toast.success("User ID copied! ✅");
                          }}
                          className="text-blue-600  hover:text-blue-700 text-sm ml-2"
                          title="Copy User ID"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
            >
              <FaUser />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Toast Container */}
      {/* <ToastContainer autoClose={2500} hideProgressBar={false} theme="light" /> */}
    </>
  );
}