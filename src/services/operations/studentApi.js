import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { setUser } from "../../redux/slices/authSlice";

import { studentEndpoints } from "../endPoints/studentEndpoints";

const { GET_ALL_COLLEGE_LIST_API, EDIT_STUDENT_DETAILS_API } = studentEndpoints;

export const getAllCollegeListForStudent = (token) => async (dispatch) => {
  const toastId = toast.loading("Searching for colleges");
  try {
    if (!token) {
      toast.dismiss(toastId);
      toast.error("Un-authorized access");
    }

    const response = await apiConnector(
      "GET",
      GET_ALL_COLLEGE_LIST_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response -> ", response);

    if (!response.data.success) {
      toast.dismiss(toastId);
      toast.error("Error in seraching colleges");
    }

    toast.dismiss(toastId);
    toast.success("Fetched sucessfully");
    return response.data.data;
  } catch (error) {
    console.log("Error in fetching the student colleges -> ", error);
    toast.dismiss(toastId);
    toast.error("Error in fetching colleges ");
  }
};

export const editStudentDetails = (data, token) => async (dispatch) => {
  const toastId = toast.loading("Saving...");
  try {
    if (!token || !data) {
      toast.dismiss(toastId);
      toast.error("Please Provide all the details");
      return;
    }

    console.log("Token -> ", token);

    const response = await apiConnector(
      "POST",
      EDIT_STUDENT_DETAILS_API,
      {
        data,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Response in api -> ", response);
    toast.dismiss(toastId);
    toast.success("Updated Successfully");
    dispatch(setUser(response?.data?.data));

    return response;
  } catch (error) {
    console.log("Error in updating student -> ", error);
    toast.dismiss(toastId);
    toast.error("Error in updating the student");
  }
};
