import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaGift } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/signup",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: res.data.message,
        confirmButtonColor: "#16a34a",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response?.data?.error || "Something went wrong!",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-gray-100 p-6 rounded shadow-md w-80"
        onSubmit={handleSignup}
      >
        <h2 className="text-xl mb-4 text-black">Sign Up</h2>

        <input
          type="text"
          className="w-full mb-2 p-2 border rounded text-black"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full mb-2 p-2 border rounded text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full mb-2 p-2 border rounded text-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          className="bg-green-500 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"
          type="submit"
        >
          Sign up to claim $10
          <FaGift className="text-pink-500 animate-bounce" />
        </button>
        <p className="text-sm pt-2 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
