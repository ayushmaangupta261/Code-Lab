import { apiConnector } from "../apiConnector.js";
import { codeEndpoints } from "../endPoints/codeEndpoints.js";
import toast from "react-hot-toast";


const { COMPILE_CODE, CreateQuestion_API, SolveQuestions_API } = codeEndpoints;


export const compileCode = (data) => async (dispatch) => {
  try {
    console.log("Data in compileCode ->", JSON.stringify(data, null, 2));

    const { code, input, lang } = data;
    if (!code || !input || !lang) {
      throw new Error("Please enter all the fields");
    }

    const response = await apiConnector("POST", COMPILE_CODE, {
      code,
      input,
      lang,
    });

    // console.log("Full Response from Compilation ->", JSON.stringify(response, null, 2));

    console.log("Response -> ", response);

    if (response?.data?.success) {
      console.log("✅ Compilation Output ->", response.data.result);
      return response.data;
    } else {
      console.log("❌ Compilation Error ->", response.output);
    }
  } catch (error) {
    console.error("❌ Error during compilation:", error);
  }
};


//  create question
export const createQuestion = (data) => async (dispatch) => {
  try {
    console.log("Hello there");

    console.log("Data in create question api -> ", data);

    const response = await apiConnector("GET", CreateQuestion_API, data);

    console.log("Full Response from API ->", response);

    if(!response.status){
      throw new Error(response.message);
    }

  } catch (error) {
    console.error("Error during question creation :-> ", error);
  }
};


// get solved question
export const getSolvedQuestion = (data) => async (dispatch) => {
  try {
    console.log("getting solved questions, solved api -> ", data);

    const response = await apiConnector("GET", SolveQuestions_API, data);

    console.log("Full Response from API ->", response);
  
    if(!response.status){
      throw new Error(response.message);
    }

  } catch (error) {
    console.log("Error during fetching solved questions :-> ", error);
  }
};
