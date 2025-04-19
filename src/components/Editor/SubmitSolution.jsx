import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import {
  compileCode,
  submitAssignment,
} from "../../services/operations/codeApi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SubmitSolution = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("java");
  const user = useSelector((state) => state.auth);

  console.log("User in assignment -> ", user.user);

  const dispatch = useDispatch();
  const location = useLocation();
  // const assignment = location.state?.assignment || {};

  const [assignment, setAssignments] = useState(
    location.state?.assignment || {}
  );

  // console.log("Assignment -> ", assignment);

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
            input
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
    if (assignment?.sampleCode?.length > 0) {
      const initialCode = assignment?.sampleCode[0]?.[language];

      setCode(initialCode);
    }
  }, [assignment]);

  return (
    <div className=" mx-auto xl:mt-[4rem] h-full xl:h-[83vh] flex flex-col xl:flex-row  gap-x-2  w-[90%] pb-[5rem]">
      {/* Theory */}
      <div
        className="  w-[90%] mx-auto xl:w-[30%] px-2 flex flex-col gap-y-4 overflow-y-auto "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <p className="flex flex-col text-justify">
          <span className="text-xl">Title : </span>
          {assignment?.title}{" "}
        </p>
        <p className="flex flex-col text-justify">
          <span className="text-xl">Description : </span>
          {assignment?.description}{" "}
        </p>

        <div>
          <img src={assignment?.images} alt="" />
        </div>

        {/* examples */}
        <div>
          <div>
            {assignment?.example?.map((sample) => (
              // console.log("Sample -> ",sample)
              <div className="flex flex-col gap-y-5">
                {/* inputs */}
                <div className="">
                  <p>Inputs :</p>
                  {sample?.input?.map((ip, index) => (
                    <div>{ip}</div>
                  ))}
                </div>
                {/* outputs */}
                <div className="">
                  <p>Outputs :</p>
                  {sample?.output?.map((op, index) => (
                    <div>{op}</div>
                  ))}
                </div>
                {/* explanation */}
                <div className="">
                  <p>Explanation :</p>
                  {sample?.explanation?.map((ep, index) => (
                    <div>{ep}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[1px]  xl:h-full bg-white"></div>

      {/* Editor */}
      <div className=" mx-auto xl:ml-[5rem] ">
        <div>
          {/* Language Selector & Run Button */}
          <div className="flex mb-4 gap-4  p-2">
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
        </div>

        {/* Input & Output */}
        <div>
          <div className="grid grid-cols-2 gap-4 mt-4  ">
            {/* input */}
            {/* <div>
              <label className="block font-medium mb-1">Input</label>
              <textarea
                className="w-full p-2 border rounded text-black"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div> */}
            {/* output */}
            <div>
              <label className="block font-medium mb-1">Output</label>
              <p className=" p-2 border w-[10rem] h-[3rem] rounded bg-gray-100 text-black flex justify-center items-center text-center">
                {output}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitSolution;
