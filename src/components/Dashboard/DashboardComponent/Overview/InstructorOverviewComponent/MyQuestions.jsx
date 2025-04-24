import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyQuestions } from "../../../../../services/operations/instructorApi";

const MyQuestions = ({ onClose }) => {
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null); // To track which question's solvedBy list to show
  const token = useSelector((state) => state.auth.user?.accessToken); // assuming token is stored here

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await dispatch(getMyQuestions(token));
      console.log("Res in ui -> ", res);
      if (res) {
        setQuestions(res);
      }
    };
    fetchQuestions();
  }, [dispatch, token]);

  const toggleSolvedByList = (questionId) => {
    setExpandedQuestion(
      (prev) => (prev === questionId ? null : questionId) // Toggle view for each question
    );
  };

  return (
    <div className="p-6 text-white flex flex-col gap-y-5">
      <div className="flex  justify-between">
        <h1 className="text-2xl font-semibold ">Your Questions</h1>
        <button
          onClick={onClose}
          className="bg-amber-300 text-black px-2 py-1 hover:scale-105 cursor-pointer rounded-md transition-all duration-200"
        >
          Back
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions found.</p>
      ) : (
        <div className="flex flex-col gap-y-4 max-h-[400px] overflow-y-auto">
          {questions.map((question) => (
            <div
              key={question._id}
              className="bg-gray-700 p-3 rounded-md shadow-md"
            >
              <h2 className="text-xl font-bold mb-2">{question.title}</h2>
              <p className="mb-2">{question.description}</p>
              <p className="mt-5">
                Solved By: {question.solvedBy.length}{" "}
                {question.solvedBy.length > 0 && (
                  <button
                    onClick={() => toggleSolvedByList(question._id)}
                    className="ml-2 0 text-blue-400 px-2 py-1 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-95"
                  >
                    {expandedQuestion === question._id
                      ? "Hide List"
                      : "View All"}
                  </button>
                )}
              </p>

              {expandedQuestion === question._id &&
                question.solvedBy.length > 0 && (
                  <ul
                    className={`mt-3 overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedQuestion === question._id
                        ? "max-h-[500px]"
                        : "max-h-0"
                    }`}
                    style={{
                      maxHeight:
                        expandedQuestion === question._id ? "500px" : "0",
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {question.solvedBy.map((student, index) => (
                        <li
                          key={index}
                          className="text-gray-100 bg-gray-800 rounded-lg p-2 shadow-md transition-all duration-200 ease-in-out"
                          style={{ flex: "0 0 auto" }}
                        >
                          {student.fullName}
                        </li>
                      ))}
                    </div>
                  </ul>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuestions;
