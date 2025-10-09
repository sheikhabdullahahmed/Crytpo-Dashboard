import React, { useState } from "react";
import axios from "axios";
import { FaEnvelopeOpenText, FaLockOpen } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/forgot-password",
        { email },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password reset link sent!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Please login first to reset password", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(err.response?.data?.error || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center mb-2">
          <FaLockOpen className="text-red-500 text-4xl" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center">
          Forgot Password
        </h2>

        <div className="relative">
          <FaEnvelopeOpenText className="absolute left-3 top-3 text-gray-500 text-lg" />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center font-semibold items-center gap-2 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
