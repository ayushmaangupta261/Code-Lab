import { apiConnector } from "../apiConnector";

import { codeEditorEndpoints } from "../endPoints/codeEditorEndpoints.js";
const { GET_FILE_TREE_API, GET_FILE_API } = codeEditorEndpoints;

export const getFileTreeStructure = async () => {
  try {
    console.log("Gettings file tree");

    const response = await apiConnector("GET", GET_FILE_TREE_API, {});
    // console.log("response -> ", response);

    return response?.data?.tree;
  } catch (error) {
    console.error("Error during fetching file tree :-> ", error);
  }
};

// get files
export const getFiles = async (selectedFile) => {
  try {
    console.log("Gettings files -> ", selectedFile);

    const path = selectedFile;

    const response = await apiConnector("POST", GET_FILE_API, { path });
    console.log("response -> ", response);

    if (!response.data.success) {
      throw new Error("File Not Found");
    }

    return response.data.content;

  } catch (err) {
    console.log("Error during fetching files -> ", err);
  }
};
