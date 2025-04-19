import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import {
  compileCode,
  submitAssignment,
} from "../../../services/operations/codeApi.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ViewSolvedQuestions = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("java");
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const assignment = location.state?.question || {};

  console.log("questions in assignment -> ", location.state);

  console.log("Assignment -> ", assignment);

  // handle compilation of code
  const handleCompile = async () => {
    try {
      console.log("🚀 Handle compile started");

      // Dispatch the compileCode action
      const response = await dispatch(
        compileCode({ code, input, lang: language })
      );

      console.log(
        "🔹 Full Response from API ->",
        JSON.stringify(response, null, 2)
      );

      if (response && response.result) {
        console.log("✅ Final output ->", response.result);
        setOutput("Accepted");
      } else {
        console.error("❌ No output found in response:", response);
        setOutput("No output received.");
      }
    } catch (error) {
      console.error("❌ Error compiling code:", error);
      setOutput("Error compiling code.");
    }
  };

  // submit solution
  const handleSubmit = async () => {
    try {
      const response = await dispatch(
        submitAssignment(
          {
            code,
            language,
            assignmentId: assignment?._id,
            input,
          },
          user?.user?.accessToken
        )
      );
      console.log("Submitted -> ", response);
    } catch (error) {}
  };

  // handle change if the coding language
  const handleChangeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    setCode(assignment.sampleCode[0]?.[selectedLanguage]);

    console.log("Code -> ", assignment?.sampleCode[0]?.[selectedLanguage]);
  };

  useEffect(() => {
    if (assignment) {
      const initialCode = assignment?.code;
      setLanguage(assignment.language);
      setCode(initialCode);
    }
  }, [assignment]);

  return (
    <div className=" mx-auto xl:mt-4 h-[80%] xl:h-[83vh] flex flex-col xl:flex-row  gap-x-5  w-[95%] pb-[5rem]">
      {/* Theory */}
      <div
        className="  w-[90%] mx-auto xl:w-[40%] px-2 flex flex-col gap-y-4 overflow-y-auto "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <p className="flex flex-col text-justify">
          <span className="text-xl">Title : </span>
          {assignment?.questionId.title}{" "}
        </p>
        <p className="flex flex-col text-justify">
          <span className="text-xl">Description : </span>
          {assignment?.questionId.description}{" "}
        </p>
      </div>

      <div className="w-full xl:w-[1px]  xl:h-full bg-white"></div>

      {/* Editor */}
      <div className=" mx-auto xl:ml-[2rem] ">
        <div>
          {/* Language Selector & Run Button */}
          <div className="flex mb-4 justify-between  p-2">
            <div className="flex gap-x-4">
              <select
                className="border p-2 rounded bg-slate-950 text-white"
                value={language}
                onChange={handleChangeLanguage}
              >
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>
              <button
                className="bg-green-500 text-black px-4 py-2 rounded"
                onClick={handleCompile}
              >
                Run
              </button>
              <button
                className="bg-green-500 text-black px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                submit
              </button>
            </div>

            {/* output */}
            <div className="flex justify-center items-center gap-x-5">
              <label className="block font-medium mb-1">Output</label>
              <p className=" p-2 border w-[10rem]  h-[2rem] rounded bg-gray-100 text-black flex justify-center items-center text-center">
                {output}
              </p>
            </div>
          </div>

          {/* Code Editor */}
          <CodeMirror
            value={code}
            height="25rem"
            width="100%"
            theme={dracula}
            extensions={[
              language === "Java"
                ? java()
                : language === "Python"
                ? python()
                : cpp(),
            ]}
            onChange={(value) => setCode(value)}
            className="border w-[20rem] md:w-[40rem] lg:w-[50rem] rounded"
          />

          <div className="flex flex-col justify-start mt-5 items-start">
            <p>Marks Obtained : {assignment.marks}/10</p>
      
          </div> 
        </div>
      </div>
    </div>
  );
};

export default ViewSolvedQuestions;
