import React, { useState, useEffect  } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaGift,
  FaEnvelope,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import {  toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);




  // ✅ Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Must contain one uppercase letter")
        .matches(/[a-z]/, "Must contain one lowercase letter")
        .matches(/\d/, "Must contain one number")
        .matches(/[@$!%*?&]/, "Must contain one special character")
        .required("Password is required"),
    }),



    

    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:5000/signup", values, {
          headers: { "Content-Type": "application/json" },
        });

        toast.success(res.data.message || "Signup Successful 🎉", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });

        setTimeout(() => navigate("/login"), 2700);
      } catch (error) {
        toast.error(error.response?.data?.error || "Signup Failed ❌", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    },


    
  });

  const isValid = formik.values.password && !formik.errors.password;
  
  useEffect(() => {
  const val = formik.values.password;
  const allValid =
    /[A-Z]/.test(val) &&
    /[a-z]/.test(val) &&
    /\d/.test(val) &&
    /[@$!%*?&]/.test(val) &&
    val.length >= 8;

  if (allValid) {
    setIsFocused(false); // auto close
  }
}, [formik.values.password]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-700 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

        {/* Name Field */}
        <div className="relative mb-1">
          <FaUser className="absolute left-3 top-3 text-gray-600" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="h-5 md:mb-2">
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-400 text-xs">{formik.errors.name}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="relative mb-1">
          <FaEnvelope className="absolute left-3 top-3 text-gray-600" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.values.email && (
            <div
              onClick={() => formik.setFieldValue("email", "")}
              className="absolute right-2 top-2 bg-gray-900 hover:bg-gray-500 text-white p-1 rounded-full cursor-pointer transition duration-200"
            >
              <FaTimes className="text-xs" />
            </div>
          )}
          <div className="h-5 md:mb-2">
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs">{formik.errors.email}</p>
            )}
          </div>
        </div>

        {/* Password Field */}
      {/* Password Field */}
<div className="relative w-full max-w-sm mb-1">
  <div className="relative">
    <FaLock className="absolute left-3 top-3 text-gray-600" />
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password"
      className={`w-full p-2 pl-10 pr-10 rounded-lg focus:outline-none bg-gray-300 transition-all duration-200 ${
        isValid
          ? "border-2 border-blue-500"
          : "focus:ring-2 focus:ring-blue-500"
      }`}
      value={formik.values.password}
      onChange={(e) => {
        formik.handleChange(e);
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />

    {/* Eye Toggle */}      
    <div
      className="absolute right-3 top-3 cursor-pointer text-gray-600"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </div>

    {/* ✅ Correct Icon */}
    {/* {isValid && (
      <FaCheckCircle className="absolute right-10 top-3 text-blue-500" />
    )} */}
  </div>

  {/* Password Validation Box */}
  <div
    className={`transition-all duration-300 overflow-hidden ${
      isFocused ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
    }`}
  >
    <div className="bg-gray-800 text-white text-xs p-3 rounded-lg space-y-1">
      <p
        className={`${
          /[A-Z]/.test(formik.values.password)
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        • One uppercase letter
      </p>
      <p
        className={`${
          /[a-z]/.test(formik.values.password)
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        • One lowercase letter
      </p>
      <p
        className={`${
          /\d/.test(formik.values.password)
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        • One number
      </p>
      <p
        className={`${
          /[@$!%*?&]/.test(formik.values.password)
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        • One special character
      </p>
      <p
        className={`${
          formik.values.password.length >= 8
            ? "text-blue-400"
            : "text-gray-400"
        }`}
      >
        • At least 8 characters
      </p>
    </div>
  </div>
</div>


        {/* Button */}
        <button
          type="submit"
          className="w-full flex justify-center md:my-4 my-4 font-semibold items-center gap-2 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all"
        >
          Sign up to claim $10 <FaGift className="text-yellow-400 animate-bounce" />
        </button>

        <p className="text-center text-white text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>

      {/* ✅ Toast Container */}
    </div>
  );
};

export default Signup;
