const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const authEnpoint = {
  RegisterUser_API: BASE_URL + "/users/register",
  LogInUser_API: BASE_URL + "/users/login",
  AuthStatus_API: BASE_URL + "/users/auth-status",
};
