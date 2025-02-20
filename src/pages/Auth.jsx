import React from 'react';
import LogIn from '../components/Auth/LogIn';
import SignUp from '../components/Auth/SignUp';
import character from "../assets/Auth/character.png"
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';



const Auth = () => {

    const [showLogIn, setShowLogIn] = useState(true);

    // Toggle login form visibility
    const toggleLogInForm = () => {
        setShowLogIn((prev) => !prev); // Toggle between LogIn and SignUp
    };

    console.log("Login form -> ", showLogIn)
    return (
        <div className='flex overflow-x-hidden xl:justify-between xl:mt-[3rem] w-[90%] lg:ml-auto shadow-2xl rounded-3xl h-[100vh] '>
        {/* left */}
        <div className='flex xl:justify-end'>
            {/* Conditionally render SignUp or LogIn */}
            {showLogIn ? <LogIn toggleLogInForm={toggleLogInForm} /> : <SignUp toggleLogInForm={toggleLogInForm} />}
        </div>

        {/* right */}
        <div className="relative w-full h-[42rem] hidden xl:block">
            {/* Image */}
            <img
                src={character}
                alt="Character"
                className="absolute top-0 right-0 w-auto h-full object-cover z-2 "
            />

            {/* Background Div */}
            {/* <div className=" bg-blue-200 w-[50%] h-[99.8%] object-fill absolute top-0 right-0 z-0 rounded-tl-3xl rounded-bl-3xl shadow-xl">
            </div> */}

           

        </div>

    </div>

    )
}

export default Auth