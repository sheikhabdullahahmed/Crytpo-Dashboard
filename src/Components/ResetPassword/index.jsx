import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams(); // URL se token le lo
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
        
      const res = await axios.post(`http://localhost:5000/reset-password/${token}`, {
        newPassword,
      });

      alert(res.data.message);
      navigate("/login"); // Reset ke baad login page pe redirect
    } catch (error) {
      console.error("Reset Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-gray-100 p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl mb-4 text-black">Reset Password</h2>

        <input
          type="password"
          className="w-full mb-2 p-2 border rounded text-black"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded text-black"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
