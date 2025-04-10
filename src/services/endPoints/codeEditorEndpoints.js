const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const codeEditorEndpoints = {
  GET_FILE_TREE_API: BASE_URL + "/code-collaboration/getFileTree",
  GET_FILE_API: BASE_URL + "/code-collaboration/getFiles",
  DELETE_FILE_API: BASE_URL + "/code-collaboration/deleteFile",
  CREATE_FILE_API: BASE_URL + "/code-collaboration/createFile",
  CREATE_FOLDER_API: BASE_URL + "/code-collaboration/createFolder",
};
