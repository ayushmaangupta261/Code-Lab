const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const codeEndpoints = {
  COMPILE_CODE: BASE_URL + "/code/compile",
  // CreateQuestion_API: BASE_URL + "/users/post-question",
  CreateQuestion_API: BASE_URL + "/assignment/auth-status",
  SolveQuestions_API: BASE_URL + "/users/get-solved-questions",
};
