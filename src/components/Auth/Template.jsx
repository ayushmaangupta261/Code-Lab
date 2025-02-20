import React, { useRef, useState } from 'react'
import SignUp from './SignUp'
import LogIn from './LogIn'
import cactus from "../../assets/Auth/cactus.png"
import character from "../../assets/Auth/character.png"
import { RxCross2 } from "react-icons/rx";
import { setModal } from '../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'


const Template = () => {

    const [showLogIn, setShowLogIn] = useState(true);

    // Toggle login form visibility
    const toggleLogInForm = () => {
        setShowLogIn((prev) => !prev); // Toggle between LogIn and SignUp
    };

    console.log("Login form -> ", showLogIn)


    const dispatch = useDispatch();

    return (
        <div className='flex justify-between  h-[42rem] mx-auto shadow-2xl rounded-3xl bg-white '>
            {/* left */}
            <div className='flex justify-start'>
                {/* Conditionally render SignUp or LogIn */}
                {showLogIn ? <LogIn toggleLogInForm={toggleLogInForm} /> : <SignUp toggleLogInForm={toggleLogInForm} />}
            </div>

            {/* right */}
            <div className="relative w-full h-[42rem]">
                {/* Image */}
                <img
                    src={character}
                    alt="Character"
                    className="absolute top-0 left-0 w-auto h-full object-cover z-2 "
                />

                {/* Background Div */}
                <div className=" bg-blue-200 w-[50%] h-[99.8%] object-fill absolute top-0 right-0 z-0 rounded-3xl shadow-xl">
                </div>

                {/* button */}
                <div> <button className='absolute right-5 top-5 text-4xl hover:scale-105 duration-200 cursor-pointer  z-5' onClick={() => dispatch(setModal(false))}><RxCross2 /></button></div>

            </div>

        </div>


    )
}

export default Template