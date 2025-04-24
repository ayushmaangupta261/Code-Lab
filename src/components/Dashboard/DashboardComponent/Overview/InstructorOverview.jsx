import React, { useState } from "react";
import { useSelector } from "react-redux";
import StudentsEnrolled from "./InstructorOverviewComponent/StudentsEnrolled";
import MyQuestions from "./InstructorOverviewComponent/MyQuestions";

const InstructorOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [showStudentsEnrolled, setShowStudentsEnrolled] = useState(false);
  const [showMyQuestions, setShowMyQuestions] = useState(false);

  if (!user || user.accountType !== "Instructor") return null;

  const toggleStudentsEnrolled = () => {
    setShowStudentsEnrolled((prevState) => !prevState);
  };

  const toggleMyQuestions = () => {
    setShowMyQuestions((prevState) => !prevState);
  };

  return (
    <div className="w-full px-6 py-8">
      {/* Render only if students enrolled view is not shown */}
      {!showStudentsEnrolled && !showMyQuestions && (
        <div className="flex flex-col gap-y-5">
          {/* Personal details */}
          <div className="flex flex-col gap-y-2 bg-gray-700 px-2 py-2 rounded-md">
            <div>
              <p className="text-xl font-semibold">Personal Details</p>
            </div>
            <div>
              <p>
                <strong>Full Name :</strong> {user.fullName}
              </p>
              <p>
                <strong>Email :</strong> {user.email}
              </p>
              <p>
                <strong>Subject :</strong> {user.subject}
              </p>
              <p>
                <strong>Mobile Number :</strong> {user.mobileNumber}
              </p>
            </div>
          </div>

          {/* College details */}
          <div className="flex flex-col gap-y-2 bg-gray-700 px-2 py-2 rounded-md">
            <div>
              <p className="text-xl font-semibold">College Details</p>
            </div>
            <div>
              {user.collegeId && (
                <div>
                  <p>
                    <strong>College Name :</strong> {user.collegeId.name}
                  </p>
                  <p>
                    <strong>Email :</strong> {user.collegeId.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Students enrolled */}
          <div className="flex justify-between items-center bg-gray-700 px-2 py-2 rounded-md">
            <p>Students Enrolled: {user.students?.length || 0}</p>
            <button
              onClick={toggleStudentsEnrolled}
              className="mr-5 bg-amber-300 items-center text-black px-2 py-1 rounded-md hover:scale-95 transition-all duration-200 cursor-pointer"
            >
              View
            </button>
          </div>

          {/* Questions created */}
          <div className="flex justify-between bg-gray-700 px-2 py-2 rounded-md">
            <p>Questions Created: {user.questions?.length || 0}</p>
            <button
              onClick={toggleMyQuestions}
              className="mr-5 bg-amber-300 text-black px-2 py-1 rounded-md hover:scale-95 transition-all duration-200 cursor-pointer"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Conditionally render the Students Enrolled section */}
      {showStudentsEnrolled && (
        <StudentsEnrolled onClose={toggleStudentsEnrolled} />
      )}

      {/* Conditionally render the My Questions section */}
      {showMyQuestions && <MyQuestions onClose={toggleMyQuestions} />}
    </div>
  );
};

export default InstructorOverview;
