import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Success Toast
      toast.success(res.data.message || "Login Successful!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      setTimeout(() => {
        navigate("/home");
      }, 2500);
    } catch (err) {
      // ❌ Error Toast
      toast.error(err.response?.data?.error || "Login Failed!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      {/* Toast Container */}
      <ToastContainer />

      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-4">Login</h2>

        {/* Email Input */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-lg" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-3 text-gray-500 text-lg" />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full flex justify-center font-semibold items-center gap-2 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        {/* Links */}
        <p className="text-center text-white text-sm mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <p className="text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-red-500 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
