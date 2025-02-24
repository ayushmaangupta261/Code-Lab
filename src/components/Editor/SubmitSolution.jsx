import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { compileCode } from "../../services/operations/codeApi";
import { useDispatch } from "react-redux";

const SubmitSolution = () => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("Cpp");
  const dispatch = useDispatch();

  const handleCompile = async () => {
    try {
      console.log("🚀 Handle compile started");

      // Dispatch the compileCode action
      const response = await dispatch(
        compileCode({ code, input, lang: language })
      );

      console.log("🔹 Full Response from API ->", JSON.stringify(response, null, 2));

      if (response && response.result) {
        console.log("✅ Final output ->", response.result);
        setOutput(response.result);
      } else {
        console.error("❌ No output found in response:", response);
        setOutput("No output received.");
      }
    } catch (error) {
      console.error("❌ Error compiling code:", error);
      setOutput("Error compiling code.");
    }
  };

  return (
    <div className="container mx-auto mt-[5rem] h-[100vh]">
      <h2 className="text-center text-2xl font-bold">Online Code Editor</h2>

      {/* Language Selector & Run Button */}
      <div className="flex mb-4 gap-4 bg-slate-900 p-2">
        <select
          className="border p-2 rounded bg-slate-950 text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="Cpp">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCompile}
        >
          Run
        </button>
      </div>

      {/* Code Editor */}
      <CodeMirror
        value={code}
        height="300px"
        theme={dracula}
        extensions={[
          language === "Java" ? java() : language === "Python" ? python() : cpp(),
        ]}
        onChange={(value) => setCode(value)}
        className="border rounded"
      />

      {/* Input & Output */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block font-medium mb-1">Input</label>
          <textarea
            className="w-full p-2 border rounded text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1">Output</label>
          <textarea
            className="w-full p-2 border rounded bg-gray-100 text-black"
            value={output}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default SubmitSolution;
