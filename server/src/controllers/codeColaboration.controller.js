import fs from "fs/promises";
import path from "path";

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

    let content = await fs.readFile(`./server/projects${path}`, "utf-8");
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

export { generateFileTree, getFiles };
