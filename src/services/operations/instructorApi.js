import { apiConnector } from "../apiConnector";
import { setUser, setAuthLoading } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

import { authEnpoint } from "../endPoints/authEndpoints.js";
const {
  REGISTER_INSTRUCTOR_API,
  LOG_IN_INSTRUCTOR_API,
  LOG_OUT_INSTRUCTOR_API,
} = authEnpoint;

import { instructorEndpoints } from "../endPoints/instructorEndpoints.js";
const {
  GET_ALL_COLLEGE_LIST_API,
  EDIT_DETAILS_API,
  GET_MY_STUDENTS_API,
  GET_MY_QUESTIONS_API,
} = instructorEndpoints;

export const getAllCollegeList = (token) => async (dispatch) => {
  const toastId = toast.loading("Searching Colleges");
  try {
    // console.log("fetching the college list api-> ", GET_ALL_COLLEGE_LIST_API);

    const response = await apiConnector(
      "GET",
      GET_ALL_COLLEGE_LIST_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // console.log("college list -> ", response);

    if (!response) {
      toast.dismiss(toastId);
      toast.error("Error in seching colleges");
      return null;
    }

    toast.dismiss(toastId);
    toast.success("Colleges found successfully");
    return response.data.data;
  } catch (error) {
    toast.dismiss(toastId);

    toast.dismiss("Error in seching colleges");
    return null;
  }
};

//------------------------------------------------

export const editDetails = (token, data) => async (dispatch) => {
  const toastId = toast.loading("Updating");
  try {
    console.log("Token -> ", token);
    console.log("Data -> ", data);

    const response = await apiConnector(
      "POST",
      EDIT_DETAILS_API,
      { token, data },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response in api -> ", response);

    if (!response.data.success) {
      toast.dismiss(toastId);
      toast.error("Error in updating the details");
    }

    toast.dismiss(toastId);
    toast.success("Updated successfully");
    dispatch(setUser(response?.data?.data));
    return true;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Error in Updation");
    console.log("Error in update api -> ", error.message);
    return false;
  }
};

export const registerInstructor = (data) => async (dispatch) => {
  dispatch(setAuthLoading(true));

  try {
    console.log("Data in registerInstructor -> ", data);
    const { fullName, userName, email, password, accountType } = data;

    if (!fullName || !email || !password || !accountType) {
      throw new Error("All fields are required");
    }

    console.log("Register api ->", REGISTER_INSTRUCTOR_API);

    const response = await apiConnector("POST", REGISTER_INSTRUCTOR_API, {
      fullName,
      userName,
      email,
      password,
      accountType,
    });

    console.log("Response from registerInstructor in authApi -> ", response);

    toast.success("Instructor Registration Done Successfully");
    dispatch(setAuthLoading(false));
    return response;
  } catch (error) {
    console.log("Error: ", error);
    dispatch(setAuthLoading(false));
    toast.error(error.message);
    return;
  }
};

export const loginInstructor = (data, navigate) => async (dispatch) => {
  dispatch(setAuthLoading(true));
  try {
    console.log("Data in loginInstructor api -> ", data);
    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new Error("Email and password are required");
    }

    const response = await apiConnector("POST", LOG_IN_INSTRUCTOR_API, {
      email,
      password,
      role,
    });

    console.log("Response from loginInstructor in authApi -> ", response);

    if (!response.data.success) {
      throw new Error("Error in instructor log in");
    }

    dispatch(setUser(response?.data?.user));

    toast.success("Instructor Logged In successfully");
    dispatch(setAuthLoading(false));
    navigate("/dashboard/overview");
  } catch (error) {
    console.log("Error: ", error);
    dispatch(setAuthLoading(false));
    toast.error(error.message);
    return;
  }
};

export const logoutInstructor = (navigate, token) => async (dispatch) => {
  try {
    // Clear instructor authentication state
    dispatch(setUser(null));

    // Clear the instructor's token and user data
    localStorage.removeItem("user");

    console.log("Token -> ", token);

    // const response = await apiConnector(
    //   "POST",
    //   LOG_OUT_INSTRUCTOR_API,
    //   {},
    //   {
    //     Authorization: `Bearer ${token}`,
    //   }
    // );

    // console.log("Logout Response in api -> ", response);

    // if (response?.data?.success) {
    toast.success("Instructor Logged out successfully");

    navigate("/");
    // }
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Unable to logout");
  }
};

// get my students
export const getMyStudents = (token) => async (dispatch) => {
  const toastId = toast.loading("Finding Enrolled Students");

  try {
    const response = await apiConnector(
      "POST",
      GET_MY_STUDENTS_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response in api -> ", response);

    if (!response) {
      toast.dismiss(toastId);
      toast.error("Error in finding the enrolled students");
    }

    toast.dismiss(toastId);
    toast.success("Enrolled Students fetched successfully");
    return response.data.data.students;
  } catch (error) {
    console.log("Error in get my students api -> ", error);
    toast.dismiss(toastId);
    toast.error("Error in finding the enrolled students");
    return false;
  }
};

// get my subjects
export const getMyQuestions = (token) => async (dispatch) => {
  const toastId = toast.loading("Finding your question");

  try {
    const response = await apiConnector(
      "POST",
      GET_MY_QUESTIONS_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response in api -> ", response);

    if (!response) {
      toast.dismiss(toastId);
      toast.error("Error in finding your questions");
    }

    toast.dismiss(toastId);
    toast.success("Your questions found successfully");
    return response.data.data;
  } catch (error) {
    console.log("Error in get my questions api -> ", error);
    toast.dismiss(toastId);
    toast.error("Error in finding my questions");
    return false;
  }
};
