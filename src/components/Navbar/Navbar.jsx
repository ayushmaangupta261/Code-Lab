import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setModal } from "../../redux/slices/authSlice.js";
import { setUser } from "../../redux/slices/authSlice.js";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../services/operations/authApi.js";
import { logout } from "../../services/operations/authApi.js";
import { logoutInstructor } from "../../services/operations/instructorApi.js";
import { logoutInstitute } from "../../services/operations/instituteAPI.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("User in navbar -> ", user);

  const handleLogOut = () => {
    if (!user) return;
  
    const role = user.accountType;
    console.log("Role ->", role);
  
    // Dispatch logout function based on role
    if (role === "Instructor") {
      dispatch(logoutInstructor(navigate));
    } else if (role === "Institute") {
      dispatch(logoutInstitute(navigate));
    } else {
      dispatch(logout(navigate)); // Student or default
    }
  };
  

  return (
    <>
      {/* Floating Desktop Navbar (Top) */}
      <div
        className="hidden lg:flex fixed top-5 left-1/2 -translate-x-1/2 min-w-[90%] 
                            bg-[#282a36] bg-opacity-80 backdrop-blur-md text-blue-300 py-3 
                            rounded-xl shadow-lg justify-between items-center px-6"
      >
        {/* Logo */}
        <button
          className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text"
          onClick={() => navigate("/")}
        >
          Code Lab
        </button>

        {/* Desktop Navigation Links */}
        <div className="flex space-x-6">
          <button
            className="text-lg hover:scale-110 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <p
            className="text-lg hover:scale-110 transition-all duration-300 cursor-pointer"
            onClick={() => navigate("about-us")}
          >
            About
          </p>
          {/* <p className="text-lg hover:scale-110 transition-all duration-300">
            Contact
          </p> */}

          <div>
            {!user && (
              <button
                className="text-lg hover:scale-110 transition-all duration-300"
                onClick={() => navigate("/auth")}
              >
                LogIn
              </button>
            )}
            {user && (
              <button
                className="text-lg hover:scale-110 transition-all duration-300"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            )}
          </div>

          {user && (
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={() => navigate("/dashboard/overview")}
            >
              Dashboard
            </button>
          )}
          {/* {user && (
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={() => navigate("/create-and-join")}
            >
              Let's Colab
            </button>
          )} */}
        </div>
      </div>

      {/* Floating Mobile Navbar (Bottom) */}
      <div
        className="lg:hidden fixed bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 w-[90%] 
                            bg-[#282a36] bg-opacity-80 backdrop-blur-md text-blue-300 
                            flex justify-around py-3 rounded-full shadow-md"
      >
        <button
          className="text-lg hover:scale-110 transition-all duration-300"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className="text-lg hover:scale-110 transition-all duration-300"
          onClick={() => navigate("/create-and-join")}
        >
          Colab
        </button>

        <button
          className="text-lg hover:scale-110 transition-all duration-300"
          onClick={() => navigate("/dashboard")}
        >
          Profile
        </button>

        <div>
          {!user && (
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={() => navigate("/auth")}
            >
              LogIn
            </button>
          )}
          {user && (
            <button
              className="text-lg hover:scale-110 transition-all duration-300"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
