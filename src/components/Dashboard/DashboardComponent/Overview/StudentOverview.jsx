



import React from "react";
import { useSelector } from "react-redux";
import "./StudentOverview.css"; // 👈 Custom CSS for scrollbar

const StudentOverview = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="text-white mx-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Overview</h1>

      <div className="flex flex-col gap-y-5 w-[60rem] mx-auto max-h-[60vh] overflow-y-auto custom-scrollbar pr-3">
        {/* Personal Details */}
        <div className="flex flex-col gap-y-5 justify-center bg-gray-700 rounded-md py-2 px-5">
          <p className="text-xl font-semibold">Personal Details</p>
          <div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Full Name :</p>
              <p className="text-gray-300">{user.fullName}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Email :</p>
              <p className="text-gray-300">{user.email}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Mobile Number :</p>
              <p className="text-gray-300">{user.mobileNumber}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Questions Solved :</p>
              <p className="text-gray-300">{user.questionsSolved.length}</p>
            </div>
          </div>
        </div>

        {/* College Details */}
        <div className="flex flex-col justify-center gap-y-5 bg-gray-700 rounded-md py-2 px-5">
          <p className="text-xl font-semibold">My College</p>
          <div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Name :</p>
              <p className="text-gray-300">{user.collegeId?.name || "N/A"}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Email :</p>
              <p className="text-gray-300">{user.collegeId?.email || "N/A"}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Student Enrolled :</p>
              <p className="text-gray-300">
                {user.collegeId?.studentsEnrolled?.length || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Instructor Details */}
        <div className="flex flex-col justify-center gap-y-5 bg-gray-700 rounded-md py-2 px-5">
          <p className="text-xl font-semibold">My Instructor</p>
          <div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Instructor :</p>
              <p className="text-gray-300">{user.instructor?.fullName}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Email :</p>
              <p className="text-gray-300">{user.instructor?.email}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Mobile Number :</p>
              <p className="text-gray-300">{user.instructor?.mobileNumber}</p>
            </div>
            <div className="flex items-center gap-x-5">
              <p className="text-lg font-semibold">Subject :</p>
              <p className="text-gray-300">{user.instructor?.subject}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
