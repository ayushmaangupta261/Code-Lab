import { setAuthLoading } from "../../redux/slices/authSlice.js";
import { apiConnector } from "../apiConnector.js";
import { codeEndpoints } from "../endPoints/codeEndpoints.js";
import toast from "react-hot-toast";

const {
  COMPILE_CODE,
  CreateQuestion_API,
  SolveQuestions_API,
  getAssignments_API,
  submitAssignments_API,
  completedAssignments_API,
} = codeEndpoints;

export const compileCode = (data) => async (dispatch) => {
  const toastId = toast.loading("Compiling Code...");
  try {
    console.log("Data in compileCode ->", JSON.stringify(data, null, 2));

    const { code, input, lang } = data;
    if (!code || !lang) {
      throw new Error("Please enter all the fields");
    }

    const response = await apiConnector("POST", COMPILE_CODE, {
      code,
      input: input ? input : null,
      lang,
    });

    console.log("Response -> ", response);

    if (response?.data?.success) {
      console.log("✅ Compilation Output ->", response.data.result);
      toast.success("Compilation Done"); // ✅ Move success toast before return
      return response.data;
    } else {
      console.log("❌ Compilation Error ->", response.output);
      toast.error("Compilation Error");
    }
  } catch (error) {
    console.error("❌ Error during compilation:", error);
    toast.error("Error compiling code");
  } finally {
    toast.dismiss(toastId); // ✅ Ensure dismissal always happens
  }
};

//  create question
export const createQuestion = (data, token) => async (dispatch) => {
  const toastId = toast.loading("Posting your question");
  try {
    console.log("Hello there");

    console.log("Data in create question api -> ", data);

    const response = await apiConnector("POST", CreateQuestion_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Full Response from API ->", response);

    if (!response.status) {
      throw new Error(response.message);
    }

    toast.dismiss(toastId);
    toast.success("Question posted successfully");
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed to post question");
    console.error("Error during question creation :-> ", error);
  }
};

// get solved question
export const getSolvedQuestion = (data) => async (dispatch) => {
  try {
    console.log("getting solved questions, solved api -> ", data);

    const response = await apiConnector("GET", SolveQuestions_API, data);

    console.log("Full Response from API ->", response);

    if (!response.status) {
      throw new Error(response.message);
    }
  } catch (error) {
    console.log("Error during fetching solved questions :-> ", error);
  }
};

// get all assignments
export const getAllAssignment = (token, instructor) => async (dispatch) => {
  // Store toast ID
  const toastId = toast.loading("Fetching assignments");

  try {
    dispatch(setAuthLoading(true));
    console.log("Going to fetch all the assignments -> ", token);

    if (!token) {
      throw new Error("Please login to access your assignments");
    }

    const response = await apiConnector(
      "GET",
      getAssignments_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response) {
      throw new Error("Failed to fetch assignments");
    }

    console.log("Full Response from API ->", response);

    // Dismiss loading toast and show success
    // Wait for 5 seconds before dismissing and showing success
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success("Assignments fetched successfully");
      dispatch(setAuthLoading(false));
    }, 5000);

    return response;
  } catch (error) {
    console.error(error);

    // Dismiss loading toast and show error
    toast.dismiss(toastId);
    toast.error("Failed to fetch assignments");
    toast.error("Failed to find assignments");

    dispatch(setAuthLoading(false));
  }
};

// submit assignments
export const submitAssignment = (data, token) => async (dispatch) => {
  // Store toast ID
  const toastId = toast.loading("Submitting");

  try {
    console.log("Going to submit the assignments -> ", data);

    if (!token) {
      throw new Error("Please login to access your assignments");
    }

    const response = await apiConnector(
      "POST",
      submitAssignments_API,
      { data },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response) {
      throw new Error("Failed to submit assignments");
    }

    console.log("Full Response from API ->", response);

    // Dismiss loading toast and show success
    // Wait for 5 seconds before dismissing and showing success

    toast.dismiss(toastId);
    toast.success("Assignments submitted successfully");

    return response;
  } catch (error) {
    console.error("Error -> ", error);

    // Dismiss loading toast and show error
    toast.dismiss(toastId);
    toast.error(error?.response?.data?.message);
  }
};

// get completed assignments
export const getCompletedAssignments = (token) => async (dispatch) => {
  const toastId = toast.loading("Fetching Solved Questions");
  try {
    console.log("Token in get completed assihnmenst -> ", token);

    const response = await apiConnector(
      "GET",
      completedAssignments_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response in api -> ", response.data.questionsSolved.length);

    if (!response.data.success) {
      toast.dismiss(toastId);
      toast.error(response.data.message);
      throw new Error(response.data.message);
    }

    toast.success("Fetched Solved Questions Successfully");
    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    toast.dismiss(toastId);
    console.log(error);
    return;
  }
};
