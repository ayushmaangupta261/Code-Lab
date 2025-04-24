const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const codeEndpoints = {
  COMPILE_CODE: BASE_URL + "/code/compile",
  CreateQuestion_API: BASE_URL + "/instructor/post-question",
  // CreateQuestion_API: BASE_URL + "/assignment/auth-status",
  SolveQuestions_API: BASE_URL + "/student/get-solved-questions",
  getAssignments_API: BASE_URL + "/assignment/get-all-assignments",
  submitAssignments_API: BASE_URL + "/assignment/submit-assignments",
  completedAssignments_API: BASE_URL + "/assignment/completed-assignments",
};
