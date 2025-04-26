import { apiConnector } from "../apiConnector";

import { codeEditorEndpoints } from "../endPoints/codeEditorEndpoints.js";
const { GET_FILE_TREE_API, GET_FILE_API, DELETE_FILE_API, CREATE_FILE_API,CREATE_FOLDER_API } =
  codeEditorEndpoints;

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

// delete files
export const deleteFile = async (selectedFile) => {
  try {
    console.log("File to delete -> ", selectedFile);

    const response = await apiConnector("DELETE", DELETE_FILE_API, {
      selectedFile,
    });

    console.log("Response: ", response);

    return response.data;
  } catch (error) {
    console.log("Error -> ", error);
  }
};

// create file
export const createFile = async (selectedFile) => {
  try {
    console.log("File in api-> ",selectedFile);

    if(!selectedFile){
      throw new Error("Please select a file");
    }

    const response = await apiConnector("POST", CREATE_FILE_API, {
      selectedFile,
    });

    console.log("Response -> ",response);

    return;
    
  } catch (error) {
    console.log("Error -> ",error);
  }
}

// create folder
 export const createFolder = async (selectedFolder) => {
  try {
    console.log("Folder in api-> ",selectedFolder);

    if(!selectedFolder){
      throw new Error("Please select a folder");
    }

    const response = await apiConnector("POST", CREATE_FOLDER_API, {
      selectedFolder,
    });

    console.log("Response -> ",response);

    return;
    
  } catch (error) {
    console.log("Error -> ",error);
  }
}