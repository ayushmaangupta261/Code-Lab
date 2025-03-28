import { apiConnector } from "../apiConnector";

import { codeEditorEndpoints } from "../endPoints/codeEditorEndpoints.js";
const { GET_FILES_API } = codeEditorEndpoints;

export const getFiles = async () => {
  try {
    console.log("Gettings files");
    
    const response = await apiConnector("GET", GET_FILES_API, {});
    console.log("response -> ", response);

    return response?.data?.tree;;

  } catch (error) {}
};
