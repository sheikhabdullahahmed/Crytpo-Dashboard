

  import React, { useState } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";

  const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/signup", {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert(res.data.message); // Signup successful
       navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Signup failed");
    }
  };


    return (
      <div className="flex justify-center items-center h-screen">
        <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSignup}>
          <h2 className="text-xl mb-4">Sign Up</h2>
          <input type="email" className="w-full mb-2 p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="w-full mb-4 p-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-green-500 text-white px-4 py-2 rounded w-full" type="submit">Sign Up</button>
        </form>
      </div>
    );
  };

  export default Signup;

