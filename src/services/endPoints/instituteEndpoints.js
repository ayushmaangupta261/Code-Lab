const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const instituteEndpoints = {
  EDIT_INSTITUTE_DETAILS_API: BASE_URL + "/institute/edit-institute-details",
};
