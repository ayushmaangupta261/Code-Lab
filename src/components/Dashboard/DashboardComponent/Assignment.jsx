import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignment } from "../../../services/operations/codeApi.js";
import AssignmentLoader from "./Loaders/Assignment.Loader.jsx";
import { useNavigate } from "react-router";
import { getCompletedAssignments } from "../../../services/operations/codeApi.js";
import checkMark from "../../../assets/Dashboard/checkmark.png";

export const Assignment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { authLoading } = useSelector((state) => state.auth);
  const [assignments, setAssignments] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (user && user.accessToken) {
        console.log("Access token -> ", user.accessToken);

        try {
          const response = await dispatch(getAllAssignment(user.accessToken));
          // console.log("Fetched Assignments ->", response?.data);
          setAssignments(response?.data?.data || []); // ✅ Ensure valid data
        } catch (error) {
          console.error("Error fetching assignments:", error);
          setAssignments([]); // ✅ Set empty array in case of failure
        }
      }
    };

    fetchAssignments();
  }, [user, dispatch]);

  // console.log("Assignments -> ", assignments);

  const solvedQuestionClickHandler = async () => {
    try {
      console.log("Fetch completed assignments -> ", user);
      const response = await dispatch(
        getCompletedAssignments(user?.user?.accessToken)
      );
      console.log("Response in ui -> ", response);

      // console("solved questions -> ",solvedQuestions)
    } catch (error) {
      console.log("Error in fetching questions");
      // toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full ">
      {authLoading ? (
        <div className="flex flex-col gap-y-5  h-full justify-center items-center ">
          <AssignmentLoader />
          <p className="text-lg">Please Wait...</p>
        </div>
      ) : (
        <div
          className="flex flex-col h-full w-[95%] mx-auto items-center mt-5 gap-y-5 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Header */}
          <div>
            <p className="text-xl">Assignments</p>
          </div>
          {/* Assignments */}
          <div className="mt-5 w-[90%] flex flex-col gap-y-3">
            {assignments?.length > 0 &&
              [...assignments]
                .sort((a, b) => b.solved - a.solved) // ✅ Solved ones come first
                .map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className={`flex items-center justify-between px-5 py-3 rounded-lg transition-all duration-300 ${
                      assignment.solved
                        ? "bg-slate-700 cursor-default"
                        : "bg-slate-600 hover:bg-slate-700 cursor-pointer"
                    }`}
                  >
                    <p className="flex gap-x-2">
                      <span>Q {index + 1}.</span>
                      {assignment.title}
                    </p>

                    {assignment.solved ? (
                      <div className="flex w-[5rem] justify-between items-center">
                        <img src={checkMark} alt="" className="w-[1.5rem]" />
                        <p className="text-green-400">Solved</p>
                      </div>
                    ) : (
                      <button
                        className="bg-amber-300 text-black px-3 py-1 rounded-md hover:scale-95 transition-all duration-200"
                        onClick={() =>
                          navigate("/editor/submitSolution", {
                            state: { assignment },
                          })
                        }
                      >
                        Solve
                      </button>
                    )}
                  </div>
                ))}
          </div>

          {/* If no assignments are present */}
          <div>
            {assignments?.length === 0 && <p>No assignments available.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
