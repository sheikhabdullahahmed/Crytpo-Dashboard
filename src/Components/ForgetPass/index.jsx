import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error sending reset link");
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-900">
  <form
    className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
    onSubmit={handleSubmit}
  >
    <h2 className="text-2xl font-bold text-white text-center">Forgot Password</h2>

    <input
      type="email"
      placeholder="Enter your email"
      className="p-3 border border-gray-600 rounded-lg w-full text-white bg-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <button
      type="submit"
      className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
    >
      Send Reset Link
    </button>

    {message && <p className="text-center text-green-400">{message}</p>}
  </form>
</div>

  );
};

export default ForgotPassword;
