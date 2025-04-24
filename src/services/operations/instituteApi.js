import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.js";
import { setAuthLoading, setUser } from "../../redux/slices/authSlice.js";

import { authEnpoint } from "../endPoints/authEndpoints.js";
const { RegisterInstitute_API, Log_Out_Institute_Api, Log_In_Institute_APi } =
  authEnpoint;

import { instituteEndpoints } from "../endPoints/instituteEndpoints.js";
const { EDIT_INSTITUTE_DETAILS_API } = instituteEndpoints;

// Institute
export const registerInstitute = (data) => async (dispatch) => {
  dispatch(setAuthLoading(true));
  try {
    console.log("Data in register Institute -> ", data);
    const { fullName, email, password } = data;
    // console.log("Full Name -> ", fullName);

    if (!fullName || !email || !password) {
      throw new Error("All fields are required");
    }

    console.log("Register api ->", RegisterInstitute_API);

    const response = await apiConnector("POST", RegisterInstitute_API, {
      name: fullName,
      email,
      password,
    });

    console.log("Response from register institute in authApi -> ", response);

    toast.success("Registration Done Successfully");

    dispatch(setAuthLoading(false));
    return response;
  } catch (error) {
    console.log("Error: ", error);
    toast.error(error.message);
    dispatch(setAuthLoading(false));
    return;
  }
};

export const loginInstitute = (data, navigate) => async (dispatch) => {
  dispatch(setAuthLoading(true));

  try {
    console.log("Data in loginInstitute API -> ", data);
    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new Error("Email, password, and role are required");
    }

    const response = await apiConnector("POST", Log_In_Institute_APi, {
      email,
      password,
      role,
    });

    console.log("Response from loginInstitute -> ", response);

    if (!response.data.success) {
      throw new Error(response.data.message || "Institute login failed");
    }

    dispatch(setUser(response?.data?.user));
    toast.success("Logged In successfully");
    dispatch(setAuthLoading(false));

    navigate("/dashboard/overview");
  } catch (error) {
    console.error("Error in loginInstitute: ", error);
    toast.error(error.message || "Login failed");
  } finally {
    dispatch(setAuthLoading(false));
  }
};

export const logoutInstitute = (navigate, token) => async (dispatch) => {
  try {
    // Clear institute authentication state
    dispatch(setUser(null));

    // Remove institute user data from localStorage
    localStorage.removeItem("user");

    // console.log("Token -> ", token);

    // const response = await apiConnector(
    //   "POST",
    //   Log_Out_Institute_Api, // Make sure this constant is defined
    //   {},
    //   {
    //     Authorization: `Bearer ${token}`,
    //   }
    // );

    // console.log("Logout Response in api -> ", response);

    // if (response?.data?.success) {
    toast.success("Institute Logged out successfully");
    navigate("/");
    // }
  } catch (error) {
    console.error("Error during institute logout:", error);
    toast.error("Unable to logout");
  }
};

export const editInstituteDetails = (subjects, token) => async (dispatch) => {
  const toastId = toast.loading("Saving the details...");
  try {
    if (!token) {
      toast.dismiss(toastId);
      return toast.error("Un-authorised access");
    }

    const response = await apiConnector(
      "POST",
      EDIT_INSTITUTE_DETAILS_API,
      { subjects },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    toast.dismiss(toastId);
    toast.success("Updated Successfully !!");
    console.log("Response -> ", response);
    dispatch(setUser(response?.data?.updatedUser));
    return true;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Failed to update subjects");
    console.error("Update Error ->", error);
  }
};
