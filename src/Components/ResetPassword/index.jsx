import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { API } from "../../api/index";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Must contain one uppercase letter")
        .matches(/[a-z]/, "Must contain one lowercase letter")
        .matches(/\d/, "Must contain one number")
        .matches(/[@$!%*?&]/, "Must contain one special character")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await API.post(
          `/reset-password/${token}`,
          { newPassword: values.password }
        );

        toast.success(res.data.message || "Password reset successful!", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });

        setTimeout(() => navigate("/login"), 2700);
      } catch (error) {
        toast.error(error.response?.data?.error || "Reset failed!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    },
  });

  const isValid = formik.values.password && !formik.errors.password;

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-700 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          Reset Password
        </h2>

        <div className="relative w-full max-w-sm mb-5">
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className={`w-full p-2 pl-10 pr-10 rounded-lg focus:outline-none bg-gray-300 transition-all duration-200 ${
                isValid ? "border-2 border-blue-500" : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

            {isValid && (
              <FaCheckCircle className="absolute right-10 top-3 text-blue-500" />
            )}
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              isFocused ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-gray-800 text-white text-xs p-3 rounded-lg space-y-1">
              <p className={/[A-Z]/.test(formik.values.password) ? "text-blue-400" : "text-gray-400"}>
                • One uppercase letter
              </p>
              <p className={/[a-z]/.test(formik.values.password) ? "text-blue-400" : "text-gray-400"}>
                • One lowercase letter
              </p>
              <p className={/\d/.test(formik.values.password) ? "text-blue-400" : "text-gray-400"}>
                • One number
              </p>
              <p className={/[@$!%*?&]/.test(formik.values.password) ? "text-blue-400" : "text-gray-400"}>
                • One special character
              </p>
              <p className={formik.values.password.length >= 8 ? "text-blue-400" : "text-gray-400"}>
                • At least 8 characters
              </p>
            </div>
          </div>
        </div>

        <div className="relative mb-1">
          <FaLock className="absolute left-3 top-3 text-gray-600" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 pl-10 rounded-lg focus:outline-none bg-gray-300 focus:ring-2 focus:ring-blue-500"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center my-4 font-semibold items-center gap-2 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;