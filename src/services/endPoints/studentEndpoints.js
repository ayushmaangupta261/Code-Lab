const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const studentEndpoints = {
  GET_ALL_COLLEGE_LIST_API:
    BASE_URL + "/student/get-all-college-list-for-student",
  EDIT_STUDENT_DETAILS_API: BASE_URL + "/student/edit-student-details",
};
