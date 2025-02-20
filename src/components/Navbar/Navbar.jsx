import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setModal } from "../../redux/slices/authSlice";
import { setUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../services/operations/authApi";
import { logout } from "../../services/operations/authApi";

const Navbar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    // console.log("User in navbar -> ", user);



    const handleLogOut = () => {
        dispatch(logout(navigate));
    };


    return (
        <>
            {/* Floating Desktop Navbar (Top) */}
            <div className="hidden lg:flex fixed top-5 left-1/2 -translate-x-1/2 min-w-[90%] 
                            bg-[#282a36] bg-opacity-80 backdrop-blur-md text-blue-300 py-3 
                            rounded-xl shadow-lg justify-between items-center px-6">

                {/* Logo */}
                <button className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text"
                    onClick={() => navigate("/")}>
                    Code Lab
                </button>

                {/* Desktop Navigation Links */}
                <div className="flex space-x-6">
                    <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/")}>Home</button>
                    <p className="text-lg hover:scale-110 transition-all duration-300">About</p>
                    <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/create-and-join")}>Let's Colab</button>

                    <div>
                        {
                            !user && (
                                <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/auth")}>LogIn</button>
                            )
                        }
                        {
                            user && (
                                <button className="text-lg hover:scale-110 transition-all duration-300" onClick={handleLogOut}>Log Out</button>
                            )
                        }

                    </div>

                    {
                        user && (
                            <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/dashboard")}>Dashboard</button>
                        )
                    }


                </div>
            </div>


            {/* Floating Mobile Navbar (Bottom) */}
            <div className="lg:hidden fixed bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 w-[90%] 
                            bg-[#282a36] bg-opacity-80 backdrop-blur-md text-blue-300 
                            flex justify-around py-3 rounded-full shadow-md">

                <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/")}>Home</button>
                <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/create-and-join")}>Colab</button>
                <div>
                    {
                        !user && (
                            <button className="text-lg hover:scale-110 transition-all duration-300" onClick={() => navigate("/auth")}>LogIn</button>
                        )
                    }
                    {
                        user && (
                            <button className="text-lg hover:scale-110 transition-all duration-300" onClick={handleLogOut}>Log Out</button>
                        )
                    }

                </div>
                <button className="text-lg hover:scale-110 transition-all duration-300">Profile</button>
            </div>
        </>
    );
};

export default Navbar;
