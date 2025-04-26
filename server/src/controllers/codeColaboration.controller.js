import fs from "fs/promises";
import path from "path";
import { getIOInstance } from "../webSocket/SocketStore.js";
import { log } from "console";

// file system
const generateFileTree = async (req, res) => {
  try {
    // const { directory } = req.body; // Get directory from request body
    // if (!directory) {
    //   return res.status(400).json({ error: "Directory path is required" });
    // }

    // console.log("Generating tree for:", directory);
    const tree = {};

    const buildTree = async (currentDir, currentTree) => {
      try {
        // console.log("Hello");

        const files = await fs.readdir(currentDir);
        for (const file of files) {
          const filePath = path.join(currentDir, file);
          const stats = await fs.stat(filePath);

          if (stats.isDirectory()) {
            currentTree[file] = {};
            await buildTree(filePath, currentTree[file]);
          } else {
            currentTree[file] = null;
          }
        }
      } catch (err) {
        console.error(`Error reading ${currentDir}:`, err.message);
      }
    };

    await buildTree("./server/projects", tree);
    return res.json({ tree }); // Send the generated tree as a response
  } catch (error) {
    console.error("Error generating file tree:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get files
const getFiles = async (req, res) => {
  try {
    const { path } = req.body;

    console.log("Path of file -> ", path);

    if (!path) {
      return res.status(400).json({ error: "Path is required" });
    }

    let content = await fs.readFile(`./server/projects/${path}`, "utf-8");
    console.log("content of file -> ", content);

    if (content.length == 0) {
      content = " ";
    }

    if (!content) {
      return res.status(400).json({
        message: "File not found",
        success: false,
      });
    }

    return res.status(200).json({
      content,
      path,
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
      success: false, // Error in reading the file
    });
  }
};

// delete file
const deleteFile = async (req, res) => {
  try {
    const { selectedFile } = req.body;

    if (!selectedFile) {
      return res.status(400).json({
        message: "Selected file or folder is required",
        success: false,
      });
    }

    // Construct the absolute path
    const filePath = path.join(
      process.cwd(),
      "server",
      "projects",
      selectedFile
    );
    console.log("Path to be deleted -> ", filePath);

    // Check if the file/folder exists
    try {
      await fs.access(filePath); // If this fails, the file doesn't exist
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, message: "File or folder not found!" });
    }

    // Delete file or folder (recursively for folders)
    await fs.rm(filePath, { recursive: true, force: true });

    const io = getIOInstance();
    if (io) {
      io.emit("file:refresh");
    }

    console.log("Deleted successfully");

    return res
      .status(200)
      .json({ success: true, message: "File or folder deleted successfully!" });
  } catch (error) {
    console.error("[SERVER] Error deleting file/folder:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// create file
const createFile = (req, res) => {
  try {
    const { selectedFile } = req.body;
    console.log("Creating File -> ", selectedFile);

    if (!selectedFile) {
      return res.status(400).json({
        message: "Selected file or folder is required",
        success: false,
      });
    }

    // Construct the absolute path
    const filePath = path.join(
      process.cwd(),
      "server",
      "projects",
      selectedFile
    );

    console.log("Full path -> ", filePath);

    fs.writeFile(filePath, "");

    console.log("File created -> ", filePath);

    const io = getIOInstance();
    if (io) {
      io.emit("file:refresh");
    }

    return res.status(200).json({
      message: "File created successfully",
      success: true,
      // path: filePath,
    });
  } catch (error) {
    console.log("Error -> ", error);
    return res.json(400).json({
      message: error.message,
      success: false, // Error in creating the file
    });
  }
};

// create file
const createFolder = (req, res) => {
  try {
    const { selectedFolder } = req.body;
    console.log("Creating File -> ", selectedFolder);

    if (!selectedFolder) {
      return res.status(400).json({
        message: "Selected file or folder is required",
        success: false,
      });
    }

    // Construct the absolute path
    const folderPath = path.join(
      process.cwd(),
      "server",
      "projects",
      selectedFolder
    );

    console.log("Full path -> ", folderPath);

    fs.mkdir(folderPath, { recursive: true });

    console.log("File created -> ", folderPath);

    const io = getIOInstance();
    if (io) {
      io.emit("file:refresh");
    }

    console.log("Refresh sent");

    return res.status(200).json({
      message: "Folder created successfully",
      success: true,
      // path: filePath,
    });
  } catch (error) {
    console.log("Error -> ", error);
    return res.json(400).json({
      message: error.message,
      success: false, // Error in creating the file
    });
  }
};

export { generateFileTree, getFiles, deleteFile, createFile, createFolder };

// import fs from "fs/promises";
// import path from "path";
// import { getIOInstance } from "../webSocket/SocketStore.js";

// let fileTreeCache = null; // Cached version of the file tree

// // Function to regenerate the file tree
// const generateFileTree = async () => {
//   try {
//     const tree = {};

//     const buildTree = async (currentDir, currentTree) => {
//       try {
//         const files = await fs.readdir(currentDir);
//         for (const file of files) {
//           const filePath = path.join(currentDir, file);
//           const stats = await fs.stat(filePath);

//           if (stats.isDirectory()) {
//             currentTree[file] = {};
//             await buildTree(filePath, currentTree[file]);
//           } else {
//             currentTree[file] = null;
//           }
//         }
//       } catch (err) {
//         console.error(`Error reading ${currentDir}:`, err.message);
//       }
//     };

//     console.log("Building");
    
//     await buildTree("./server/projects", tree);
//     fileTreeCache = tree; // Cache the file tree
//     return tree;
//   } catch (error) {
//     console.error("Error generating file tree:", error.message);
//     throw new Error("Internal Server Error");
//   }
// };

// // Function to get file tree (from cache or regenerate it if necessary)
// const getFileTree = async (req, res) => {
//   try {
//     if (!fileTreeCache) {
//       // Regenerate file tree if it's not cached
//       const tree = await generateFileTree();
//       return res.json({ tree });
//     } else {
//       // Return cached tree
//       return res.json({ tree: fileTreeCache });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Get file content
// const getFiles = async (req, res) => {
//   try {
//     const { path: filePath } = req.body;

//     if (!filePath) {
//       return res.status(400).json({ error: "Path is required" });
//     }

//     let content = await fs.readFile(`./server/projects/${filePath}`, "utf-8");

//     // if (!content) {
//     //   return res.status(404).json({ message: "File not found", success: false });
//     // }

//     // If file is empty, return a default space
//     if (content.length === 0) {
//       content = " ";
//     }

//     return res.status(200).json({
//       content,
//       path: filePath,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error reading file:", error.message);
//     return res.status(500).json({ message: error.message, success: false });
//   }
// };

// // Delete file or folder
// const deleteFile = async (req, res) => {
//   try {
//     const { selectedFile } = req.body;

//     if (!selectedFile) {
//       return res.status(400).json({
//         message: "Selected file or folder is required",
//         success: false,
//       });
//     }

//     const filePath = path.join(
//       process.cwd(),
//       "server",
//       "projects",
//       selectedFile
//     );

//     try {
//       await fs.access(filePath); // Check if file exists
//     } catch (error) {
//       return res
//         .status(404)
//         .json({ success: false, message: "File or folder not found!" });
//     }

//     await fs.rm(filePath, { recursive: true, force: true });

//     // Clear the cache after deletion to force regeneration on the next request
//     fileTreeCache = null;

//     const io = getIOInstance();
//     if (io) {
//       io.emit("file:refresh", { filePath });
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "File or folder deleted successfully!" });
//   } catch (error) {
//     console.error("Error deleting file/folder:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Create a file
// const createFile = async (req, res) => {
//   try {
//     const { selectedFile } = req.body;

//     if (!selectedFile) {
//       return res.status(400).json({
//         message: "Selected file is required",
//         success: false,
//       });
//     }

//     const filePath = path.join(
//       process.cwd(),
//       "server",
//       "projects",
//       selectedFile
//     );

//     await fs.writeFile(filePath, "");

//     // Clear the cache after creation to force regeneration on the next request
//     fileTreeCache = null;

//     const io = getIOInstance();
//     if (io) {
//       io.emit("file:refresh", { filePath });
//     }

//     return res.status(200).json({
//       message: "File created successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error creating file:", error.message);
//     return res.status(400).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };

// // Create a folder
// const createFolder = async (req, res) => {
//   try {
//     const { selectedFolder } = req.body;

//     if (!selectedFolder) {
//       return res.status(400).json({
//         message: "Selected folder is required",
//         success: false,
//       });
//     }

//     const folderPath = path.join(
//       process.cwd(),
//       "server",
//       "projects",
//       selectedFolder
//     );

//     await fs.mkdir(folderPath, { recursive: true });

//     // Clear the cache after folder creation to force regeneration on the next request
//     fileTreeCache = null;

//     const io = getIOInstance();
//     if (io) {
//       io.emit("file:refresh", folderPath);
//     }

//     return res.status(200).json({
//       message: "Folder created successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error creating folder:", error.message);
//     return res.status(400).json({
//       message: error.message,
//       success: false,
//     });
//   }
// };

// export { generateFileTree, getFiles, deleteFile, createFile, createFolder };
