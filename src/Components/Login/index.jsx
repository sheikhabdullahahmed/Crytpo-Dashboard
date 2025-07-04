import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault(); // ✅ Important to prevent form reload

  const res = await axios.post(
  "http://localhost:5000/user/login",
  { email, password },
  {
    withCredentials: true, // ✅ Required for cookies
    headers: {
      "Content-Type": "application/json",
    },
  }
);

  
  const data = await res.json();
  if (!res.ok) {
    console.log("Login error:", data.error);
    alert(data.error);
    return;
  }

  console.log("Login successful, token:", data.token);
  // Optional: localStorage.setItem("token", data.token);
  // navigate("/dashboard"); // if you have dashboard route
};



  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleLogin}>
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          className="w-full mb-2 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
