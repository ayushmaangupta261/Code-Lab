import React, { useEffect, useRef, useState } from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import { getFileTreeStructure } from "../../services/operations/codeEditorApi.js";
import { initSocket } from "../../services/socket.js";
import fileImg from "../../assets/Editor/fileImg.png"

/** ───────────────────────────────────────────────
 *  Recursive Component for Displaying Files & Folders
 *  ─────────────────────────────────────────────── */
const FileTreeNode = ({ name, nodes, onSelect, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check if it's a folder (even if empty)
  const isFolder = nodes && typeof nodes === "object";
  const hasChildren = isFolder && Object.keys(nodes).length > 0;

  return (
    <div
      className="ml-4 text-gray-200 cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        if (isFolder) return;
        onSelect(path);
      }}
    >
      {/* Folder/File Name */}
      <div
        className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded-md"
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          isOpen ? (
            <FaFolderOpen className="text-yellow-400" />
          ) : (
            <FaFolder className="text-yellow-400" />
          )
        ) : (
         <img src={fileImg} alt="" className="w-[1rem]" />
        )}
        <span>{name}</span>
      </div>

      {/* Display child nodes or 'Empty' message */}
      {isFolder && isOpen && (
        <div className="ml-4 border-l-2 border-gray-600 pl-2">
          {hasChildren ? (
            Object.keys(nodes).map((key, index) => (
              <FileTreeNode
                key={index}
                name={key}
                nodes={nodes[key]}
                path={path + "/" + key}
                onSelect={onSelect}
              />
            ))
          ) : (
            <div className="text-gray-400 italic text-sm px-2 py-1">
              <span className="text-gray-300">Empty !!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** ───────────────────────────────────────────────
 *  Function to Merge New Files into Existing Tree
 *  ─────────────────────────────────────────────── */
const mergeFileTree = (prevTree, newTree) => {
  if (!prevTree) return newTree;

  // Clone the previous tree to avoid mutation
  let mergedTree = { ...prevTree };

  Object.keys(newTree).forEach((key) => {
    if (typeof newTree[key] === "object") {
      mergedTree[key] = mergeFileTree(prevTree[key], newTree[key]); // Merge recursively
    } else {
      mergedTree[key] = newTree[key]; // Overwrite if it's a file
    }
  });

  return mergedTree;
};

/** ───────────────────────────────────────────────
 *  Main FileTree Component
 *  ─────────────────────────────────────────────── */
const FileTree = ({ onSelect }) => {
  const socketRef = useRef(null);
  const [fileTree, setFileTree] = useState(null);

  /** ───────────────────────────────────────────────
   *  Fetch File Tree Data (Runs Only on Mount)
   *  ─────────────────────────────────────────────── */
  useEffect(() => {
    const getFileTree = async () => {
      try {
        console.log("Fetching file tree...");
        const tree = await getFileTreeStructure();
        console.log("File tree received ->", tree);
        if (!tree || typeof tree !== "object") {
          console.error("Invalid file tree data:", tree);
          return;
        }
        setFileTree(tree); // ✅ Update state immutably
      } catch (error) {
        console.error("Error fetching file tree:", error);
      }
    };

    getFileTree();
  }, []); // ✅ Fetch data once on mount

  /** ───────────────────────────────────────────────
   *  Listen for File Refresh Events via WebSockets
   *  ─────────────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        if (!socketRef.current) {
          console.error("Failed to initialize socket connection.");
          return;
        }

        socketRef.current.on("file:refresh", async (updatedPath) => {
          console.log(`Received 'file:refresh' event for: ${updatedPath}`);
          try {
            const newTree = await getFileTreeStructure(); // Fetch updated files

            setFileTree((prevTree) => mergeFileTree(prevTree, newTree)); // Merge new files into existing state
          } catch (err) {
            console.error("Error fetching updated files:", err);
          }
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("file:refresh");
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 w-64 h-full p-3 rounded-md shadow-md overflow-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">
        File Explorer
      </h3>
      {fileTree ? (
        <FileTreeNode
          name="Projects"
          nodes={fileTree}
          path=""
          onSelect={onSelect}
        />
      ) : (
        <p className="text-gray-400">Loading files...</p>
      )}
    </div>
  );
};

export default FileTree;
