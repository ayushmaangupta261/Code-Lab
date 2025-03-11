import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { createQuestion } from "../../../services/operations/codeApi.js";

const CreateQuestion = () => {
  const { user } = useSelector((state) => state.auth);

  console.log("User -> ", user);

  const {
    register,
    handleSubmit,
    setValue,
    reset, // ✅ Added reset function
    formState: { errors },
  } = useForm();
  const codeRef = useRef({ java: "", cpp: "", python: "" });

  const dispatch = useDispatch();

  const handleCodeChange = (language) => (value) => {
    codeRef.current[language] = value;
    setValue(language, value);
  };

  // ✅ Function to log all form values and clear the form
  // const onSubmit = (data) => {
  //   console.log("✅ Form Data:", {
  //     ...data,
  //     code: codeRef.current, // ✅ Includes code sections
  //   });

  //   // ✅ Clear form fields
  //   // reset();
  //   // codeRef.current = { java: "", cpp: "", python: "" };

  //   const response = createQuestion(data);
  // };

  const onSubmit = async (data) => {
    console.log("✅ Form Data:", {
      ...data,
      code: codeRef.current, // ✅ Includes code sections
    });

    try {
      // Send the form data to the backend
      console.log("Sending the data ");

      const response = await dispatch(
        createQuestion(
          {
            ...data,
            code: codeRef.current,
          },
          user?.accessToken // ✅ Pass token separately
        )
      );

      // if (response.success) {
      //     console.log("✅ Question Created Successfully");

      //     // ✅ Reset form fields
      //     // reset();
      //     // codeRef.current = { java: "", cpp: "", python: "" };
      // } else {
      //     console.error("❌ Error creating question:", response.message);
      // }
    } catch (error) {
      console.error("❌ Submission failed:", error);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col overflow-y-auto max-h-[80vh] pb-5">
        {/* Title */}
        <div className="mt-2">
          <p className="text-gray-100 text-xl text-center">
            Hey, <span className="text-[#a486ff]">{user?.fullName}</span>,
            please fill in the details to create the question.
          </p>
        </div>

        {/* Create Question Form */}
        <div className="w-full mt-5">
          <form
            className="w-full flex flex-col justify-center items-center gap-y-5"
            onSubmit={handleSubmit(onSubmit)} // ✅ Fixed form submission
          >
            {/* Title Input */}
            <div className="w-[90%]">
              <label className="block text-gray-100 text-sm font-medium mb-2">
                Question Title
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="bg-gray-500 w-full rounded-md h-[2rem] px-1"
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="w-[90%]">
              <label className="block text-gray-100 text-sm font-medium mb-2">
                Question Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="bg-gray-500 w-full rounded-md h-[3rem] px-1 "
              />

              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Code Editors Wrapper */}
            <div className="w-[90%] border border-gray-600 rounded-md p-3">
              <p className="block text-gray-100 text-sm font-medium mb-2">
                Code structure
              </p>
              <div className="max-h-[350px] overflow-auto">
                {[
                  { lang: "java", extension: java },
                  { lang: "cpp", extension: cpp },
                  { lang: "python", extension: python },
                ].map(({ lang, extension }) => (
                  <div key={lang} className="mb-4">
                    <label className="block text-gray-100 text-sm font-medium mb-2">
                      {lang.toUpperCase()}
                    </label>
                    <div className="h-[200px] overflow-hidden rounded-md border border-gray-600">
                      <CodeMirror
                        value={codeRef.current[lang]}
                        height="100%"
                        extensions={[extension()]} // ✅ Fix for syntax highlighting
                        theme={dracula}
                        onChange={handleCodeChange(lang)}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Inputs */}
            <div className="w-[90%]">
              <label className="block text-gray-100 text-sm font-medium mb-2">
                Sample Inputs
              </label>
              <input
                type="text"
                {...register("sampleInput", {
                  required: "Sample Input is required",
                })}
                className="bg-gray-500 w-full rounded-md h-[2rem] px-1"
              />
              {errors.sampleInput && (
                <p className="text-red-500">{errors.sampleInput.message}</p>
              )}
            </div>

            {/* Sample Output */}
            <div className="w-[90%]">
              <label className="block text-gray-100 text-sm font-medium mb-2">
                Sample Output
              </label>
              <input
                type="text"
                {...register("sampleOutput", {
                  required: "Sample Output is required",
                })}
                className="bg-gray-500 w-full rounded-md h-[2rem] px-1"
              />
              {errors.sampleOutput && (
                <p className="text-red-500">{errors.sampleOutput.message}</p>
              )}
            </div>

            {/* Explanation */}
            <div className="w-[90%]">
              <label className="block text-gray-100 text-sm font-medium mb-2">
                Explanation
              </label>
              <textarea
                {...register("explanation", {
                  required: "Explanation is required",
                })}
                className="bg-gray-500 w-full rounded-md h-[100px] px-1"
              />
              {errors.explanation && (
                <p className="text-red-500">{errors.explanation.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex mt-2 justify-center">
              <button
                type="submit"
                className="bg-amber-300 text-black px-2 py-2 rounded-md hover:scale-105 duration-200 cursor-pointer"
              >
                Submit Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
