// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/ForgetPass";
import ResetPassword from "./Components/ResetPassword";
import Home from './Pages/Home'
// import WalletLogin from './Components/WalletLogin/index';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
      <Router>
        <ToastContainer 
          theme="dark" 
          position="top-right"
          autoClose={3000}
        />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* <Route path="/wallet-login" element={<WalletLogin />} /> */}


          {/* {baki routes} */}
          <Route path="/home" element={<Home />} />



        </Routes>
      </Router>
  );
}

export default App;