import { apiConnector } from "../apiConnector";
import { authEnpoint } from "../endPoints/authEndpoints";
import {
  setAuthLoading,
  setUser,
  // setToken,
} from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const {
  Register_Student_API,
  LogIn_Student_API,
  AuthStatus_API,
  RegisterInstitute_API,
  LogOut_Student_API,
} = authEnpoint;

// register user
export const registerUser = (data) => async (dispatch) => {
  dispatch(setAuthLoading(true));
  try {
    console.log("Data in registerUser -> ", data);
    const { fullName, userName, email, password, accountType } = data;
    // console.log("Full Name -> ", fullName);

    if (!fullName || !email || !password || !accountType) {
      throw new Error("All fields are required");
    }

    console.log("Register api ->", Register_Student_API);

    const response = await apiConnector("POST", Register_Student_API, {
      fullName,
      userName,
      email,
      password,
      accountType,
    });

    console.log("Response from register user in authApi -> ", response);

    dispatch(setAuthLoading(false));

    toast.success("Registration Done Successfully");

    return response;
  } catch (error) {
    console.log("Error: ", error);
    dispatch(setAuthLoading(false));
    toast.error(error.message);
  }
};

// login user
export const login = (data, navigate) => async (dispatch) => {
  dispatch(setAuthLoading(true));
  try {
    console.log("Data in login api -> ", data);
    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new Error("Email and password are required");
    }

    const response = await apiConnector("POST", LogIn_Student_API, {
      email,
      password,
      role,
    });

    console.log(
      "Response from login user in authApi -> ",
      response?.data?.user
    );

    if (!response.data.success) {
      throw new Error("Error in log in");
    }

    // dispatch(setAuthLoading(false));
    dispatch(setUser(response?.data?.user));

    // dispatch(setToken(response.data.user.accessToken));

    toast.success("Logged In successfully");

    navigate("/dashboard/overview");

    dispatch(setAuthLoading(false));

    // return response;
  } catch (error) {
    console.log("Error: ", error);
    dispatch(setAuthLoading(false));
    toast.error("Login Error, check your credentials");
  }
};

// log out user
export const logout = (navigate) => async (dispatch) => {
  try {
    // Clear authentication state
    // dispatch(setToken(null));
    dispatch(setUser(null));

    // const userString = localStorage.getItem("user");
    // const user = userString ? JSON.parse(userString) : null;
    // const token = user?.accessToken;

    // // localStorage.removeItem("token");
    localStorage.removeItem("user");

    // console.log("Token -> ", token);

    // const response = await apiConnector(
    //   "POST",
    //   LogOut_Student_API,
    //   {},
    //   {
    //     Authorization: `Bearer ${token}`,
    //   }
    // );

    // console.log("Logout Response in api -> ", response);

    // if (response?.data?.success) {
    // Provide feedback
    toast.success("Logged out successfully");

    // Navigate to home page
    navigate("/");
    // }
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Unable to logout");
  }
};

// auth status
export const authStatus = async (token) => {
  try {
    console.log("Auth status check");

    const authResponse = await apiConnector(
      "GET",
      AuthStatus_API,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Auth Response -> ", authResponse);

    return authResponse;
  } catch (error) {
    console.log("Error in auth status -> ", error);
    toast.response(`${error.response.data.message} , please login`);
  }
};
