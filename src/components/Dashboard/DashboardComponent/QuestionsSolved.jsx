import React, { useEffect, useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { color } from "@uiw/react-codemirror";
import { getCompletedAssignments } from "../../../services/operations/codeApi.js";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import checkMark from "../../../assets/Dashboard/checkmark.png";

const QuestionsSolved = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const findCompletedAssignments = async () => {
      if (!user) {
        toast.error("Unauthorized");
        return;
      }

      try {
        console.log("Fetch completed assignments -> ", user);
        const response = await dispatch(
          getCompletedAssignments(user?.user?.accessToken)
        );
        console.log("Response in ui -> ", response);
        setSolvedQuestions(response?.questionsSolved);
        setTotalQuestions(response?.totalQuestions);
        // console("solved questions -> ",solvedQuestions)
      } catch (error) {
        console.log("Error in fetching questions");
        // toast.error(error.message);
      }
    };

    findCompletedAssignments();
  }, []);

  return (
    <div className=" w-full h-full p-2">
      {/* Intro section */}
      <div className="mx-auto w-full flex justify-center text-gray-200 mt-3">
        <p className="text-xl">Assignments Completed</p>
      </div>
      {/* Guage section */}
      <div className="flex  justify-between items-center w-[50%] shadow  mx-auto mt-10 bg-gray-600 px-10 rounded-md py-2 ">
        {/* gage */}
        <div className="text-gray-200  w-[15rem] h-[10rem]  p-0 ">
          <Gauge
            value={solvedQuestions?.length || 0}
            startAngle={-110}
            endAngle={110}
            valueMax={totalQuestions || 100}
            text={({ value, valueMax }) => `${value} / ${valueMax}`}
            sx={(theme) => ({
              [`& .MuiGauge-valueText`]: {
                fill: "#ffffff", // white color
                fontSize: "1.5rem",
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: theme.palette.text.disabled,
              },
            })}
            className="w-40 text-gray-200 "
          />
        </div>
        {/* text */}
        <div className="">
          <ul>
            <li>Solved : {solvedQuestions?.length}</li>
            {/* <li>Total Questions : {totalQuestions}</li> */}
            <li>Total Questions : 100</li>

          </ul>
        </div>
      </div>
      {/* Solved questions */}
      <div className="flex flex-col justify-center mt-10 gap-y-3 w-[80%] mx-auto overflow-auto ">
        <div className="flex justify-between w-[6rem]    ">
          <img src={checkMark} alt="" className="w-[2rem]" />
          <p className="text-xl">solved</p>
        </div>
        {/* solved questions */}
        <div className="flex flex-col gap-y-3 overflow-y-auto max-h-[12rem] pr-2 scrollbar-hidden scrollbar-thumb-slate-500 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-400 rounded-md ">
          {solvedQuestions?.length > 0 &&
            solvedQuestions.map((question, index) => (
              <div
                key={question._id}
                className="flex items-center justify-between px-5 py-3 rounded-lg bg-slate-700  "
              >
                <p className="flex gap-x-2">
                  <span className="">Q {index + 1}.</span>
                  {question?.questionId?.title}
                </p>
                {/* <p>{assignment.description}</p> */}
                <button
                  className="bg-amber-300 text-black px-3 py-1 rounded-md hover:scale-95 transition-all duration-200"
                  onClick={() =>
                    navigate("view-solved-questions", {
                      state: { question }, // ✅ Send assignment data
                    })
                  }
                >
                  View
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsSolved;
