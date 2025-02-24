import React, { useEffect } from 'react'
import starBg from "../assets/Home/starBg.png"
import flyingCat from "../assets/Home/flyingCat.png"
import globe from "../assets/Home/globe.png"
import compiler from "../assets/Home/compiler.png"
import CodeBlocks from '../components/Home/CodeBlocks'
import HighlightText from '../components/Home/HighlightText'
import flying_planet from "../assets/Home/flying_planet.png"
import code from "../assets/Home/code.jpg"
import { RiLoginCircleLine } from "react-icons/ri";

import { authStatus } from '../services/operations/authApi'
import { useSelector } from 'react-redux'


const Home = () => {

  const { user } = useSelector((state) => state.auth);

  console.log("Token -> ", user);


  useEffect(() => {
    // authStatus(user?.accessToken);
  }, []);


  return (
    <div
      className=" w-full h-auto pb-[10rem] bg-center flex flex-col items-center  z-5  text-white"
    // style={{ backgroundImage: `url(${starBg})` }}
    >

      {/* <div className='mt-[2rem] mr-auto'>
        <button className="text-3xl  font-bold cursor-pointer bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text lg:hidden "
          onClick={() => navigate("/")}>
          Code Lab
        </button>
      </div> */}


      {/* Hero Section */}
      <div className='w-11/12 h-auto mt-[2rem] mx-auto md:mt-[7rem] flex flex-col  justify-evenly items-center text-white '>

        <p className="text-3xl sm:text-5xl lg:text-6xl text-center w-full tracking-wide ">
          <span className=' text-emerald-500'>Accelerate your{" "}</span>
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text ">
            coding skills with CodeLab
          </span>
        </p>

        <div className='mt-[4rem] w-[15rem] mx-auto flex justify-between items-center bg-gray-900  px-2 py-2 rounded-2xl shadow  hover:scale-105 transition-all duration-200 '>
          <button className='   text-amber-300  mx-auto cursor-pointer'>Hey! wanna become a pro
          </button>
          <RiLoginCircleLine className='cursor-pointer text-amber-300 mt-1' />
        </div>

        <div className='flex flex-col lg:flex-row justify-evenly items-center mt-[4rem] text-white w-full'>


          {/* right */}
          <div className='text-white w-[90%] lg:w-[30%] z-0 mx-auto lg:mx-0  lg:text-start flex flex-col justify-center  gap-y-5 font-semibold  lg:mr-10'>
            <p className='text-4xl bg-gradient-to-r hidden md:block from-orange-500 to-orange-800 text-transparent bg-clip-text'>CodeLab</p>
            <p className='text-lg font-light  text-justify mx-auto'>Welcome to CodeLab, go-to online codee editor! Designed with user friendliness in mind, CodeLab offers an INTUTIVE and SEAMLESS coding experience. Whether you’re a beginner or an experienced developer, our platform provides all the tool you need to write,test and share . Join the CodeLab Community and unlock your coding potencial today!  </p>
            <button className='bg-blue-500 shadow-2xl shadow-gray-700  text-white w-[8rem] mt-10 mx-auto rounded-md text-center py-2 hover:scale-105 transition-all duration-200 cursor-pointer ' >Start Coding</button>
          </div>


          {/* Code section 1 */}
          <div className="hidden lg:flex justify-center ">
            <CodeBlocks
              position={" flex-col md:flex-row"}
              codeblock={`public class Example {
              public static void main(String[] args) {
          
                  int a = 10, b = 20;
                  int sum = a+b;
                  System.out.println("Sum: " + sum);
                                
              }
          }
          
          Output:
          Sum: 30
          `}
              codeColor={" text-cyan-950"}
            />
          </div>


        </div>

      </div>



      {/*  code editor */}
      <div className=' w-[90%] lg:w-[80%] flex flex-col lg:flex-row mt-[5rem] justify-between mx-auto items-start gap-x-10'>

        {/* left */}
        <div className='flex flex-col lg:flex-row lg:w-[50%] justify-center items-center lg:justify-start z-0'>
          <p className='text-3xl tracking-wider font-semibold lg:hidden mb-7'><span className='bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text'>Online Co</span><span className='text-emerald-500'>de Editor</span></p>

          <img src={code} alt="" className='w-[100%] lg:mt-[2rem]' />

        </div>

        {/* right */}
        <div className='w-[90%] -[50%] mt-[2rem] lg:mt-[5rem] flex flex-col mx-auto lg:items-start'>
          <p className='text-4xl font-semibold hidden lg:block'><span className='bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text'>Online Co</span><span className='text-emerald-500'>de Editor</span></p>
          <p className='text-justify text-lg font-thin mt-5 text-orange-400'>Experience the simplecity and power of coding with our intuitive code editor. Designed for developers of all leaves, Our editor provides the tools and features you need to bring your ideas to life. <br />
          </p>
          <p className='text-justify text-lg font-thin mt-5 text-gray-300 '>Get started today and unlock your potential, one line code at a time. With our coding courses, you can learn at own pace from anywhere in the world and get access to a wealth of resouces, including hands-on projects, quizzes and personalized feedback from instructor </p>
          <p className='text-justify text-lg font-thin mt-5 text-emerald-500'>Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lessons.</p>

          <div className='mx-auto  flex justify-center '>
            <button className='bg-blue-500 shadow-2xl shadow-gray-700  text-white w-[8rem] mt-10 mx-auto rounded-md text-center py-2 hover:scale-105 transition-all duration-200 cursor-pointer'>Start Coding</button>
          </div>
        </div>

      </div>



      {/* image */}
      {/* <div className='w-full mt-10 '>
        <img src={globe} alt="" className='w-full' />
      </div> */}

      {/* image */}
      {/* <div className='w-full  mt-[15rem] '>
        <img src={flying_planet} alt="" className='w-full' />
      </div> */}



    </div>
  )
}

export default Home