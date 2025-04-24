const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const instructorEndpoints = {
  GET_ALL_COLLEGE_LIST_API: BASE_URL + "/instructor/get-all-college-list",
  EDIT_DETAILS_API: BASE_URL + "/instructor/edit-details",
  GET_MY_STUDENTS_API: BASE_URL + "/instructor/get-my-students",
  GET_MY_QUESTIONS_API: BASE_URL + "/instructor/get-my-questions",
};
