const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const authEnpoint = {
  Register_Student_API: BASE_URL + "/student/register",
  LogIn_Student_API: BASE_URL + "/student/login",
  LogOut_Student_API: BASE_URL + "/student/logout",
  AuthStatus_API: BASE_URL + "/users/auth-status",

  // Institute
  RegisterInstitute_API: BASE_URL + "/institute/register-institute",
  Log_In_Institute_APi: BASE_URL + "/institute/login-institute",
  Log_Out_Institute_Api: BASE_URL + "/institute/logout-institute",

  // instructor
  LOG_IN_INSTRUCTOR_API: BASE_URL + "/instructor/login-instructor",
  REGISTER_INSTRUCTOR_API: BASE_URL + "/instructor/register-instructor",
  LOG_OUT_INSTRUCTOR_API: BASE_URL + "/instructor/logout-instructor",
};
