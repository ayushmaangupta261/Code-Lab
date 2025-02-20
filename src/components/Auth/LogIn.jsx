import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import google from "../../assets/Auth/google.png";
import social from "../../assets/Auth/social.png"
import github from "../../assets/Auth/github.png"
import { login } from "../../services/operations/authApi";
import { useNavigate } from "react-router";

const LogIn = ({ toggleLogInForm }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authLoading } = useSelector((state) => state.auth);


  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const submitForm = (data) => {
    console.log("Log In data -> ", data);
    dispatch(login(data, navigate));

    reset();
  };


  return (
    <div className="flex justify-center items-center h-[40rem] w-[25rem] mx-auto">

      {
        authLoading ?
          (<div class="card">
            <div class="loader">
              <div class="words ">
                <span class="word">Verifying</span>
                <span class="word">Processing</span>
                <span class="word">Logging In</span>
                <span class="word">Please Wait</span>
              </div>
            </div>
          </div>)
          :
          (<div className=" p-6 rounded-lg flex flex-col gap-y-5 ">

            <div className="flex flex-col">
              <p className="">Welcome Back !!!</p>
              <p className="text-4xl font-semibold">Log In</p>
            </div >

            {/* Login Form */}
            < form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-y-4 mt-10" >

              {/* Email */}
              < div className="flex flex-col" >
                <label>Email:</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-gray-500 w-[20rem] rounded-md h-[2rem] px-1 hover:scale-105 duration-200" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div >


              {/* Password */}
              < div className="flex flex-col" >
                <label>Password:</label>
                <div className="relative w-[20rem]">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "Password is required" })}
                    className="bg-gray-500 w-[20rem] rounded-md h-[2rem] px-1 hover:scale-105 duration-200"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex justify-center items-center"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                  {errors.password && (
                    <span className=" text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div >

              {/* Submit Button */}
              < div className="flex mt-2 justify-center w-[20rem]" >
                <button type="submit" className="bg-amber-400 text-black px-2 py-2 rounded-[5rem] w-[8rem] hover:scale-95 duration-200 cursor-pointer">LogIn</button>
              </div >
            </form >

            {/* OAuth Login */}
            < div className="flex flex-col w-[20rem] mt-10 items-center justify-center gap-y-3" >
              <p className="text-sm">
                or <span className="text-blue-400 select-none">LogIn with</span>
              </p>
              <div className="flex items-center justify-between gap-x-10">
                <button className="w-[5rem] h-[3rem] border border-blue-300 flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer bg-white">
                  <img src={google} alt="Google" className="w-[30%]" />
                </button>
                <button className="w-[5rem] h-[3rem] border border-blue-300 flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer text-white bg-white">
                  <img src={github} alt="GitHub" className="w-[30%] text-white" />
                </button>
              </div>
              <p className="text-sm mt-5">
                Don't have an account? <button className="text-pink-500 hover:scale-95 duration-200 cursor-pointer" onClick={toggleLogInForm}>SignUp</button>
              </p>
            </div >

          </div >)
      }


    </div >
  );
};

export default LogIn;
