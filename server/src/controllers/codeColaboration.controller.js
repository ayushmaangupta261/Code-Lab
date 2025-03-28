
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
        console.log("Hello");
        
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

    await buildTree("./server/temp", tree);
    return res.json({ tree }); // Send the generated tree as a response
  } catch (error) {
    console.error("Error generating file tree:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export { generateFileTree };
