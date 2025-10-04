import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboardfor() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  

  return (
    <div className="flex flex-col w-64 bg-white text-gray-700 h-screen shadow-md">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button
          className="rounded-lg md:hidden focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
            {open ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            )}
          </svg>
        </button>
      </div>

      <nav className={`flex-1 px-4 py-2 ${open ? "block" : "hidden"} md:block`}>
        {[
          // { name: "Dashboard", path: "/dashboard" },
          { name: "Profile", path: "/user/profile" },
          { name: "Home", path: "/user/home" },
        ].map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-gray-200"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
