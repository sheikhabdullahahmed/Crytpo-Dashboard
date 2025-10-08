import React, { useState } from "react";
import axios from "axios";
import { FaEnvelopeOpenText, FaLockOpen } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post("http://localhost:5000/forgot-password", { email }, { withCredentials: true });

    toast.success(res.data.message || "Password reset link sent!", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
  } catch (err) {
    if (err.res?.status === 401) {
      // 👇 yahan hum wo backend wali condition handle kar rahe hain
      toast.error("Please login first to reset password", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error(err.res?.data?.error || "Something went wrong", {
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
        {/* Icon on top */}
        <div className="flex justify-center mb-2">
          <FaLockOpen className="text-red-500 text-4xl" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center">Forgot Password</h2>

        {/* Email Input with icon */}
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

        {/* Submit Button */}
        <button
          type="submit"
          // className="w-full py-3 bg-red-600 text-white rounded-3xl font-medium hover:bg-red-700 transition-all"
          className="w-full flex justify-center font-semibold items-center gap-2 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all"
        
        >
          Send Reset Link
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm ${
              message.toLowerCase().includes("error")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
