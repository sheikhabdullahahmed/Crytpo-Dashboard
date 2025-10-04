import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Pages/Navbar";
import Dashboardfor from "../Components/Dashboardfor";
import { Outlet, useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user")
      .then((res) => setUser(res.data.user))
      .catch(() => navigate("/login"));
  }, []);

  return (
    <>
      {/* <Navbar /> */}
      <Navbar user={user} />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 h-full bg-white shadow-md border-r border-gray-200">
          <Dashboardfor />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="p-4 flex-1">
            {/* Sirf Loading dikhaye jab tak user fetch nahi hota */}
            {!user ? (
              <p>Loading...</p>
            ) : (
              <Outlet context={{ user }} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}