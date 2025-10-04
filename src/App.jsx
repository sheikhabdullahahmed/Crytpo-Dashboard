import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/ForgetPass";
import ResetPassword from "./Components/ResetPassword";
import DashboardLayout from "./Layout/Dashboard";
import Profile from "./Pages/Profile";
import HomePage from "./Pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Auth Routes */}
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔹 Dashboard Layout (Navbar + Sidebar) */}
        <Route path="/user" element={<DashboardLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
