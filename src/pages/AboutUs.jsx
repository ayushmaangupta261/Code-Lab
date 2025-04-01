import React from "react";
import growth from "../assets/About/growth.mp4";

const AboutUs = () => {
  return (
    <div className="bg-[#121212] text-white min-h-screen w-full">
      {/* Hero Section */}
      <section className="text-center py-20 ">
        <h1 className="text-5xl font-bold text-white">About Us</h1>
        <p className="text-lg mt-4 w-[90%] text-center mx-auto text-gray-300">
          At CodeLab, we believe in the power of technology to shape the future.
          Our mission is to create a dynamic and collaborative environment where
          developers, designers, and tech enthusiasts come together to innovate,
          learn, and grow. We strive to bridge the gap between theory and
          real-world application by providing hands-on learning experiences,
          mentorship from industry experts, and a thriving community of
          like-minded individuals.
          
          Whether you're a beginner exploring the world of coding or an
          experienced developer looking to sharpen your skills, CodeLab offers
          the right platform to fuel your growth.
        </p>
      </section>

      {/* Mission Section */}
      <div className=" mx-auto mt-7 ">
        <div className="flex  w-[90%] mx-auto gap-x-6 ">
          <section className="mx-auto text-center py-5 px-3 bg-gray-800  rounded-xl shadow">
            <h2 className="text-3xl font-semibold text-white">Our Mission</h2>
            <p className="text-lg mt-4 text-center mx-auto text-gray-300">
              CodeLab is dedicated to empowering individuals through hands-on
              coding experiences, real-world projects, and mentorship. We aim to
              bridge the gap between theoretical learning and practical
              application, helping developers of all levels refine their skills
              and build impactful solutions.
            </p>
          </section>
          <section className=" mx-auto text-center py-5 px-3 bg-gray-700 rounded-xl shadow">
            <h2 className="text-3xl font-semibold text-white">Our Vission</h2>
            <p className="text-lg mt-4  text-center mx-auto text-gray-300">
              We envision a future where technology is accessible to everyone,
              fostering creativity, problem-solving, and innovation. Through
              workshops, coding boot camps, and open-source collaborations,
              CodeLab strives to be a leading force in the tech education
              ecosystem.
            </p>
          </section>
        </div>
        {/* what we offer */}
        <section className="bg-black mx-auto text-center py-16 px-6">
          <h2 className="text-3xl font-semibold">What we offer !</h2>
          <ul className="mt-6 text-gray-300 w-[50%] mx-auto grid grid-cols-2 gap-y-10">
            <li className="bg-gray-800 py-3 px-6 rounded-lg   w-[20rem] h-[5rem] hover:scale-105 transition-all duration-200">
              Live Coding Sessions: Interactive learning with expert mentors.
            </li>
            <li className="bg-gray-800 py-3 px-6 rounded-lg  w-[20rem] h-[5rem] hover:scale-105 transition-all duration-200">
              Project-Based Learning: Hands-on experience with real-world
              challenges.
            </li>
            <li className="bg-gray-800 py-3 px-6 rounded-lg  w-[20rem] h-[5rem] hover:scale-105 transition-all duration-200">
              Tech Community: A thriving network of like-minded developers.
            </li>
            <li className="bg-gray-800 py-3 px-6 rounded-lg  w-[20rem] h-[5rem] hover:scale-105 transition-all duration-200">
              Career Growth: Guidance to help individuals transition into tech
              careers.
            </li>
          </ul>
        </section>
      </div>

      {/* Team Section */}
      <section className="py-16 bg-gray-800">
        <h2 className="text-center text-3xl font-semibold">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8 w-[50%] mx-auto ">
          {/* Members 1 */}
          <div className="bg-gray-700 p-6 rounded-lg w-64 text-center ">
            {/* <img
              src=""
              alt="Team Member"
              className="mx-auto rounded-full"
            /> */}
            <h3 className="text-xl font-semibold mt-4">Ayushmaan Gupta</h3>
            <p className="text-gray-400">CEO & Founder</p>
          </div>
          {/* Memeber 2 */}
          <div className="bg-gray-700 p-6 rounded-lg w-64 text-center  ">
            {/* <img
              src=""
              alt="Team Member"
              className="mx-auto rounded-full"
            /> */}
            <h3 className="text-xl font-semibold mt-4">Shrishti Godamker</h3>
            <p className="text-gray-400">CTO</p>
          </div>
        </div>
      </section>

      {/* ending */}
      <div className=" flex justify-center items-end ">
        <p className="mt-5">
          Join CodeLab and be part of a movement that turns ideas into reality !
          🚀
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
