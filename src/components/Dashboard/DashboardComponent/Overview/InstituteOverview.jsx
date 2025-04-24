import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md"; // email icon
import { MdClose } from "react-icons/md"; // close icon
import "./StudentOverview.css";
import { useEffect } from "react";

const InstituteOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showInstructors, setShowInstructors] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);

  const studentCount = useCountUp(user?.studentsEnrolled?.length || 0);
  const instructorCount = useCountUp(user?.instructorsPresent?.length || 0);
  const subjectCount = useCountUp(user?.subjects?.length || 0);

  function useCountUp(target, duration = 500) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = target / (duration / 10); // how much to increment every 10ms

      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.ceil(start));
        }
      }, 10);

      return () => clearInterval(interval);
    }, [target, duration]);

    return count;
  }

  const handleCopy = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopied(true);
      toast.success("College ID copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const closeModal = () => {
    setShowStudents(false);
    setShowInstructors(false);
    setShowSubjects(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 text-white">
      {/* Institute Name */}
      <div className="text-center">
        <p className="text-4xl py-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 inline-block">
          {user?.name}
        </p>

        {/* Styled Email */}
        <div className="flex justify-center items-center gap-2">
          <MdEmail className="text-3xl text-emerald-400" />
          <span className="text-sm text-center text-gray-400 bg-gray-700 px-3 py-1 rounded-full shadow-sm transition-all hover:bg-gray-600">
            {user?.email}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-around bg-gray-800 py-6 mt-10 rounded-xl shadow-md">
        <div
          className="text-center cursor-pointer "
          onClick={() => setShowStudents((prev) => !prev)}
        >
          <div className="flex mx-auto justify-center items-center gap-x-2">
            <p
              className="text-2xl font-semibold cursor-pointer "
             
            >
              {studentCount}
            </p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">
            Students Enrolled
          </p>
        </div>
        <div
          className="text-center cursor-pointer "
          onClick={() => setShowInstructors((prev) => !prev)}
        >
          <div className="flex mx-auto justify-center items-center gap-x-2">
            <p
              className="text-2xl font-semibold cursor-pointer"
           
            >
              {instructorCount}
            </p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">Faculties</p>
        </div>
        <div
          className="text-center cursor-pointer "
          onClick={() => setShowSubjects((prev) => !prev)}
        >
          <div className="flex mx-auto justify-center items-center gap-x-2">
            <p className="text-2xl font-semibold cursor-pointer">
              {subjectCount}
            </p>
            <p className="text-xl">+</p>
          </div>
          <p className="text-sm text-gray-400 tracking-widest">
            Subjects Offered
          </p>
        </div>
      </div>

      {/* Modal for Students List */}
      {showStudents && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <button
            className="absolute top-[25%] right-[29%] text-2xl text-whit rounded-full px-2 py-2 bg-gray-600 hover:scale-95 transition-all duration-200"
            onClick={closeModal}
          >
            <MdClose />
          </button>
          <div className="bg-gray-800 p-6 rounded-md max-w-lg w-full  relative">
            <p className="text-xl font-semibold mb-3">Students List</p>

            <div className="h-[15rem] overflow-y-auto  custom-scrollbar pr-3 ">
              {/* Students List */}
              <ul className="flex flex-col gap-y-2 custom-scrollbar">
                {user?.studentsEnrolled.map((student, index) => (
                  <li
                    key={index}
                    className="text-gray-100 bg-gray-700 px-3 py-2 rounded-md"
                  >
                    <p>{student.fullName}</p>
                    <p className="text-sm text-gray-100">
                      Questions Solved: {student.questionsSolved.length || 0}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Instructors List */}
      {showInstructors && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <button
            className="absolute top-[25%] right-[29%] text-2xl text-whit rounded-full px-2 py-2 bg-gray-600 hover:scale-95 transition-all duration-200"
            onClick={closeModal}
          >
            <MdClose />
          </button>
          <div className="bg-gray-800 p-6 rounded-md max-w-lg w-full  relative">
            <p className="text-xl font-semibold mb-3">Students List</p>

            <div className="h-[15rem] overflow-y-auto  custom-scrollbar pr-3 ">
              <ul className="flex flex-col gap-y-2">
                {user?.instructorsPresent.map((instructor, index) => (
                  <li
                    key={index}
                    className="text-gray-100 bg-gray-700 px-3 py-2 rounded-md"
                  >
                    <p>{instructor.fullName}</p>
                    <p className="text-sm text-gray-400">
                      Subject: {instructor.subject}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Subjects List */}
      {showSubjects && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <button
            className="absolute top-[25%] right-[29%] text-2xl text-whit rounded-full px-2 py-2 bg-gray-600 hover:scale-95 transition-all duration-200"
            onClick={closeModal}
          >
            <MdClose />
          </button>
          <div className="bg-gray-800 p-6 rounded-md max-w-lg w-full  relative">
            <p className="text-xl font-semibold mb-3">Students List</p>

            <div className="h-[15rem] overflow-y-auto  custom-scrollbar pr-3 ">
              <ul className="flex flex-col gap-y-2">
                {user?.subjects.map((subject, index) => (
                  <li
                    key={index}
                    className="text-gray-100 bg-gray-700 px-3 py-2 rounded-md"
                  >
                    <p>{subject}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* College ID */}
      <div className="mx-auto flex flex-col items-center mt-10">
        <p className="text-2xl font-medium mb-2">College ID</p>
        <div className="flex items-center gap-3 bg-gray-700 px-4 py-2 rounded-md">
          <span className="text-sm md:text-base font-mono">{user?._id}</span>
          <button
            onClick={handleCopy}
            className="text-emerald-400 hover:text-emerald-300 transition-all"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstituteOverview;
