// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import google from "../../assets/Auth/google.png";
// import github from "../../assets/Auth/github.png";
// import { login } from "../../services/operations/authApi";
// import { useNavigate } from "react-router";
// import { loginInstructor } from "../../services/operations/instructorApi";
// import { loginInstitute } from "../../../server/src/controllers/institute.controller";

// const LogIn = ({ toggleLogInForm }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();
//   const [showPassword, setShowPassword] = useState(false);
//   const [role, setRole] = useState("Student"); // ✅ Default selection: User
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { authLoading } = useSelector((state) => state.auth);

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const submitForm = (data) => {
//     console.log("Log In data -> ", data);

//     // ✅ Include role in submission
//     const loginData = {
//       ...data,
//       role, // "User" or "Institute"
//     };

//     console.log("Final Login Data ->", loginData);
//     dispatch(login(loginData, navigate));

//     // ✅ Reset form and reset role
//     reset();
//     setRole("Student");
//   };

//   return (
//     <div className="flex justify-center items-center h-[40rem] w-[25rem] mx-auto">
//       {authLoading ? (
//         <div className="card">
//           <div className="loader">
//             <div className="words">
//               <span className="word">Verifying</span>
//               <span className="word">Processing</span>
//               <span className="word">Logging In</span>
//               <span className="word">Please Wait</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="p-6 rounded-lg flex flex-col gap-y-5">
//           <div className="flex flex-col">
//             <p>Welcome Back !!!</p>
//             <p className="text-4xl font-semibold">Log In</p>
//           </div>

//           {/* ✅ Role Selection - User or Institute (Radio Buttons) */}
//           <div className="flex flex-col gap-y-1 ">
//             <p className="text-sm font-medium">Select Role:</p>
//             <div className="flex items-center gap-x-5 ">
//               {["Student", "Instructor", "Institute"].map((type) => (
//                 <label
//                   key={type}
//                   className={`cursor-pointer flex items-center justify-center gap-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105
//                       ${
//                         role === type
//                           ? "bg-blue-400 text-white font-medium border-blue-600 w-[5rem] text-center"
//                           : "text-gray-200 border-gray-500 w-[5rem] text-center"
//                       }`}
//                 >
//                   <input
//                     type="radio"
//                     value={type}
//                     checked={role === type}
//                     onChange={() => setRole(type)}
//                     className="hidden"
//                   />
//                   {type}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Login Form */}
//           <form
//             onSubmit={handleSubmit(submitForm)}
//             className="flex flex-col gap-y-4 mt-2"
//           >
//             {/* Email */}
//             <div className="flex flex-col">
//               <label>Email:</label>
//               <input
//                 type="email"
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
//                     message: "Invalid email address",
//                   },
//                 })}
//                 className="bg-gray-500 w-[20rem] rounded-md h-[2rem] px-1 hover:scale-105 duration-200"
//               />
//               {errors.email && (
//                 <p className="text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="flex flex-col">
//               <label>Password:</label>
//               <div className="relative w-[20rem]">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   {...register("password", {
//                     required: "Password is required",
//                   })}
//                   className="bg-gray-500 w-[20rem] rounded-md h-[2rem] px-1 hover:scale-105 duration-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[1.8rem] w-[1.8rem] flex justify-center items-center"
//                 >
//                   {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
//                 </button>
//                 {errors.password && (
//                   <span className="text-red-500">
//                     {errors.password.message}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex mt-2 justify-center w-[20rem]">
//               <button
//                 type="submit"
//                 className="bg-amber-400 text-black px-2 py-2 rounded-[5rem] w-[8rem] hover:scale-95 duration-200 cursor-pointer"
//               >
//                 Log In
//               </button>
//             </div>
//           </form>

//           {/* OAuth Login */}
//           <div className="flex flex-col w-[20rem] mt-10 items-center justify-center gap-y-3">
//             <p className="text-sm">
//               or <span className="text-blue-400 select-none">Log In with</span>
//             </p>
//             <div className="flex items-center justify-between gap-x-10">
//               <button className="w-[5rem] h-[3rem] border border-blue-300 flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer bg-white">
//                 <img src={google} alt="Google" className="w-[30%]" />
//               </button>
//               <button className="w-[5rem] h-[3rem] border border-blue-300 flex justify-center items-center rounded-3xl hover:scale-105 duration-200 cursor-pointer text-white bg-white">
//                 <img src={github} alt="GitHub" className="w-[30%] text-white" />
//               </button>
//             </div>
//             <p className="text-sm mt-5">
//               Don't have an account?{" "}
//               <button
//                 className="text-pink-500 hover:scale-95 duration-200 cursor-pointer"
//                 onClick={toggleLogInForm}
//               >
//                 Sign Up
//               </button>
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LogIn;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import google from "../../assets/Auth/google.png";
import github from "../../assets/Auth/github.png";
import { login } from "../../services/operations/authApi";
import { useNavigate } from "react-router";
import { loginInstructor } from "../../services/operations/instructorApi.js";
import { loginInstitute } from "../../services/operations/instituteAPI";

const LogIn = ({ toggleLogInForm }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Student"); // ✅ Default selection: User
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authLoading } = useSelector((state) => state.auth);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const loginStudentApi = (data) => {
    const loginData = {
      ...data,
      role: "Student",
    };
    dispatch(login(loginData, navigate));
  };

  const loginInstructorApi = (data) => {
    const loginData = {
      ...data,
      role: "Instructor",
    };
    dispatch(loginInstructor(loginData, navigate));
  };

  const loginInstituteApi = (data) => {
    const loginData = {
      ...data,
      role: "Institute",
    };
    dispatch(loginInstitute(loginData, navigate));
  };

  const submitForm = (data) => {
    console.log("Log In data -> ", data);

    // ✅ Role-based API call
    if (role === "Student") {
      loginStudentApi(data);
    } else if (role === "Instructor") {
      loginInstructorApi(data);
    } else if (role === "Institute") {
      loginInstituteApi(data);
    }

    // Reset form and reset role after submission
    reset();
    setRole("Student");
  };

  return (
    <div className="flex justify-center items-center h-[40rem] w-[25rem] mx-auto">
      {authLoading ? (
        <div className="card">
          <div className="loader">
            <div className="words">
              <span className="word">Verifying</span>
              <span className="word">Processing</span>
              <span className="word">Logging In</span>
              <span className="word">Please Wait</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-lg flex flex-col gap-y-5">
          <div className="flex flex-col">
            <p>Welcome Back !!!</p>
            <p className="text-4xl font-semibold">Log In</p>
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-y-1 ">
            <p className="text-sm font-medium">Select Role:</p>
            <div className="flex items-center gap-x-5 ">
              {["Student", "Instructor", "Institute"].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer flex items-center justify-center gap-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 
                      ${
                        role === type
                          ? "bg-blue-400 text-white font-medium border-blue-600 w-[5rem] text-center"
                          : "text-gray-200 border-gray-500 w-[5rem] text-center"
                      }`}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={role === type}
                    onChange={() => setRole(type)}
                    className="hidden"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(submitForm)}
            className="flex flex-col gap-y-4 mt-2"
          >
            {/* Email */}
            <div className="flex flex-col">
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
                className="bg-gray-500 w-[20rem] rounded-md h-[2rem] px-1 hover:scale-105 duration-200"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label>Password:</label>
              <div className="relative w-[20rem]">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
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
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex mt-2 justify-center w-[20rem]">
              <button
                type="submit"
                className="bg-amber-400 text-black px-2 py-2 rounded-[5rem] w-[8rem] hover:scale-95 duration-200 cursor-pointer"
              >
                Log In
              </button>
            </div>
          </form>

          {/* OAuth Login */}
          <div className="flex flex-col w-[20rem] mt-10 items-center justify-center gap-y-3">
            <p className="text-sm">
              or <span className="text-blue-400 select-none">Log In with</span>
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
              Don't have an account?{" "}
              <button
                className="text-pink-500 hover:scale-95 duration-200 cursor-pointer"
                onClick={toggleLogInForm}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogIn;
