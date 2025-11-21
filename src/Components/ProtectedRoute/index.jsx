import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/verify", {
             withCredentials: true, 
        });
        
        if (!res.data.loggedIn) navigate("/watch");
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
};

export default ProtectedRoute;
