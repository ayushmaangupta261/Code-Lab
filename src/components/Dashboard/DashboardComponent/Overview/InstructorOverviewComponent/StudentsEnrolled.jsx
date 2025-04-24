import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyStudents } from "../../../../../services/operations/instructorApi.js";

const StudentsEnrolled = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const token = user?.accessToken;
  const dispatch = useDispatch();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const findEnrolledStudents = async () => {
      const response = await dispatch(getMyStudents(token));
      setStudents(response || []);
    };

    findEnrolledStudents();
  }, [dispatch, token]);

  return (
    <div className="text-white p-5 rounded-md mt-5  ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Enrolled Students : {students?.length}
        </h3>
        <button
          onClick={onClose}
          className="bg-amber-300 text-black px-2 py-1 hover:scale-105 cursor-pointer rounded-md transition-all duration-200"
        >
          Back
        </button>
      </div>

      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="flex flex-col gap-y-4 max-h-[400px] overflow-y-auto">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-gray-700 p-3 rounded-md shadow-md"
            >
              <p>
                <strong>Name :</strong> {student.fullName}
              </p>
              <p>
                <strong>Email :</strong> {student.email}
              </p>
              <p>
                <strong>Mobile :</strong> {student.mobileNumber}
              </p>
              <p>
                <strong>Questions Solved :</strong>{" "}
                {student.questionsSolved?.length || 0}
                <span>
                  {""} / {user.questions?.length || 0}
                </span>
              </p>
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default StudentsEnrolled;
