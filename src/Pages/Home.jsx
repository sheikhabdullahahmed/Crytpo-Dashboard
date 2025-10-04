
import { useOutletContext } from "react-router-dom";
import React from "react";
import Dashboard from "../Components/Dashboardfor/index";
import  Navbar  from "../Pages/Navbar";

const HomePage = () => {
  const { user } = useOutletContext();
  return (
    <>

      <main>
        <h2>{user ? user._id : "no id found"}</h2>
        <h2>{user ? user.email : "No user found"}</h2>


        {/* <Navbar /> */}
        {/* <Assets/> */}

        {/* <Dashboard/> */}
       
      </main>
    </>
  );
};

export default HomePage;
