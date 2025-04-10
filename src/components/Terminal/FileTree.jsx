import React, { useEffect, useRef, useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaTrash,
  FaPlus,
  FaFolderPlus,
  FaEllipsisV,
  FaFileAlt,
} from "react-icons/fa";
import {
  getFileTreeStructure,
  deleteFile,
  createFile,
  createFolder,
} from "../../services/operations/codeEditorApi.js";
import { initSocket } from "../../services/socket.js";
import fileImg from "../../assets/Editor/fileImg.png";
import { BsFileEarmarkPlusFill  } from "react-icons/bs";

// const FileTreeNode = ({
//   name,
//   nodes,
//   path,
//   onSelect,
//   onDelete,
//   refreshTree,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [newItemName, setNewItemName] = useState("");
//   const [showInput, setShowInput] = useState(false);
//   const [isCreatingFolder, setIsCreatingFolder] = useState(false);

//   const isFolder = nodes && typeof nodes === "object";
//   const hasChildren = isFolder && Object.keys(nodes).length > 0;

//   const handleCreate = async () => {
//     if (!newItemName.trim()) return alert("Name cannot be empty!");

//     try {
//       const fullPath = `${path}/${newItemName}`;
//       console.log("File path -> ", fullPath);

//       if (isCreatingFolder) {
//         await createFolder(fullPath);
//         console.log("Folder created");
//       } else {
//         await createFile(fullPath);
//         console.log("File created");
//       }

//       setNewItemName("");
//       setShowInput(false);
//       refreshTree(); // Refresh file tree after creation
//     } catch (error) {
//       console.error("Error creating:", error);
//     }
//   };

//   const handleContextMenu = (e) => {
//     e.preventDefault();
//     setContextMenu({
//       visible: true,
//       x: e.pageX,
//       y: e.pageY,
//     });
//   };

//   const handleClickOutside = () => setContextMenu({ visible: false, x: 0, y: 0 });

//   useEffect(() => {
//     window.addEventListener("click", handleClickOutside);
//     return () => window.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <div className="ml-4 text-gray-200 cursor-pointer select-none">
//       {/* Folder/File Name with Actions */}
//       <div
//         className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded-md"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (isFolder) setIsOpen(!isOpen);
//           else onSelect(path);
//         }}
//       >
//         {isFolder ? (
//           isOpen ? (
//             <FaFolderOpen className="text-yellow-400" />
//           ) : (
//             <FaFolder className="text-yellow-400" />
//           )
//         ) : (
//           <img src={fileImg} alt="file" className="w-[1rem]" />
//         )}
//         <span>{name}</span>

//         {/* File/Folder Actions */}
//         {isFolder && (
//           <div className="ml-auto flex gap-1">
//             <FaFileAlt
//               className="text-blue-400 hover:text-blue-500"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsCreatingFolder(false);
//                 setShowInput(!showInput);
//               }}
//             />
//             <FaFolder
//               className="text-green-400 hover:text-green-500"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setIsCreatingFolder(true);
//                 setShowInput(!showInput);
//               }}
//             />
//           </div>
//         )}

//         {/* Delete Button */}
//         {path !== "" && (
//           <FaTrash
//             className="text-red-500 hover:text-red-700"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(path);
//             }}
//           />
//         )}
//       </div>

//       {/* Input for Creating Files/Folders */}
//       {showInput && (
//         <div className="ml-6 flex items-center gap-2">
//           <input
//             type="text"
//             value={newItemName}
//             onChange={(e) => setNewItemName(e.target.value)}
//             placeholder={`Enter ${isCreatingFolder ? "Folder" : "File"} Name`}
//             className="p-1 w-full rounded bg-gray-700 text-gray-300"
//           />
//           <button
//             className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
//             onClick={handleCreate}
//           >
//             <FaPlus />
//           </button>
//         </div>
//       )}

//       {/* Child Nodes (If Open) */}
//       {isFolder && isOpen && (
//         <div className="ml-4 border-l-2 border-gray-600 pl-2">
//           {hasChildren ? (
//             Object.keys(nodes).map((key, index) => (
//               <FileTreeNode
//                 key={index}
//                 name={key}
//                 nodes={nodes[key]}
//                 path={`${path}/${key}`}
//                 onSelect={onSelect}
//                 onDelete={onDelete}
//                 refreshTree={refreshTree}
//               />
//             ))
//           ) : (
//             <div className="text-gray-400 italic text-sm px-2 py-1">Empty</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

const FileTreeNode = ({
  name,
  nodes,
  path,
  onSelect,
  onDelete,
  refreshTree,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isFolder = nodes && typeof nodes === "object";
  const hasChildren = isFolder && Object.keys(nodes).length > 0;

  const handleCreate = async () => {
    if (!newItemName.trim()) return alert("Name cannot be empty!");

    try {
      const fullPath = `${path}/${newItemName}`;

      if (isCreatingFolder) {
        await createFolder(fullPath);
      } else {
        await createFile(fullPath);
      }

      setNewItemName("");
      setShowInput(false);
      refreshTree();
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="ml-2 text-gray-200 cursor-pointer select-none">
      {/* Node Display */}
      <div
        className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded-md"
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(path);
        }}
      >
        {isFolder ? (
          isOpen ? (
            <FaFolderOpen className="text-yellow-400" />
          ) : (
            <FaFolder className="text-yellow-400" />
          )
        ) : (
          <img src={fileImg} alt="file" className="w-[1rem]" />
        )}

        <span>{name}</span>

        {/* Action Menu */}
        <div className="ml-auto relative">
          <FaEllipsisV
            className="hover:text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setShowInput(false);
              setShowMenu((prev) => !prev);
            }}
          />

          {showMenu && (
            <div
              className="absolute right-0 mt-1 p-2 bg-gray-700 text-white shadow-md rounded-md z-10 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {isFolder && (
                <>
                  <BsFileEarmarkPlusFill 
                    title="Create File"
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => {
                      setIsCreatingFolder(false);
                      setShowInput(true);
                      setShowMenu(false);
                    }}
                  />
                  <FaFolderPlus
                    title="Create Folder"
                    className="cursor-pointer hover:text-green-400"
                    onClick={() => {
                      setIsCreatingFolder(true);
                      setShowInput(true);
                      setShowMenu(false);
                    }}
                  />
                </>
              )}
              {path !== "" && (
                <FaTrash
                  title="Delete"
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => {
                    onDelete(path);
                    setShowMenu(false);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Field */}
      {showInput && (
        <div className="ml-6 flex items-center gap-2 mt-1">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={`Enter ${isCreatingFolder ? "Folder" : "File"} Name`}
            className="p-1 w-full rounded bg-gray-700 text-gray-300"
          />
          <button
            className="p-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={handleCreate}
          >
            <FaPlus />
          </button>
        </div>
      )}

      {/* Recursive Children */}
      {isFolder && isOpen && (
        <div className="ml-2 border-l-2 border-gray-600 ">
          {hasChildren ? (
            Object.keys(nodes).map((key, index) => (
              <FileTreeNode
                key={index}
                name={key}
                nodes={nodes[key]}
                path={`${path}/${key}`}
                onSelect={onSelect}
                onDelete={onDelete}
                refreshTree={refreshTree}
              />
            ))
          ) : (
            <div className="text-gray-400 italic text-sm px-2 py-1">Empty</div>
          )}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ onSelect }) => {
  const socketRef = useRef(null);
  const [fileTree, setFileTree] = useState(null);

  useEffect(() => {
    const getFileTree = async () => {
      try {
        const tree = await getFileTreeStructure();
        setFileTree(tree);
      } catch (error) {
        console.error("Error fetching file tree:", error);
      }
    };

    getFileTree();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        if (!socketRef.current) {
          console.error("Failed to initialize socket connection.");
          return;
        }

        socketRef.current.on("file:refresh", async () => {
          try {
            console.log("Files refreshing");
            const newTree = await getFileTreeStructure();
            setFileTree(newTree);
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

  const handleDelete = async (path) => {
    try {
      await deleteFile(path);
      const newTree = await getFileTreeStructure();
      setFileTree(newTree);
    } catch (error) {
      console.error("Error deleting file/folder:", error);
    }
  };

  return (
    <div className="bg-gray-800 w-64 min-h-[10rem] h-full p-3 pb-10 rounded-md shadow-md overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2 text-gray-300">
        File Explorer
      </h3>

      {fileTree ? (
        <FileTreeNode
          name="Projects"
          nodes={fileTree}
          path=""
          onSelect={onSelect}
          onDelete={handleDelete}
          refreshTree={async () => {
            const newTree = await getFileTreeStructure();
            setFileTree(newTree);
          }}
        />
      ) : (
        <p className="text-gray-400">Loading files...</p>
      )}
    </div>
  );
};

export default FileTree;

// import React, { useEffect, useRef, useState } from "react";
// import { FaFolder, FaFolderOpen, FaTrash } from "react-icons/fa";
// import {
//   getFileTreeStructure,
//   deleteFile,
// } from "../../services/operations/codeEditorApi.js";
// import { initSocket } from "../../services/socket.js";
// import fileImg from "../../assets/Editor/fileImg.png";
// import ACTIONS from "../../constants/Actions.js";

// const FileTreeNode = ({ name, nodes, onSelect, path, onDelete }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const isFolder = nodes && typeof nodes === "object";
//   const hasChildren = isFolder && Object.keys(nodes).length > 0;

//   return (
//     <div className="ml-4 text-gray-200 cursor-pointer select-none">
//       <div
//         className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded-md"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (isFolder) {
//             setIsOpen(!isOpen);
//           } else {
//             onSelect(path);
//           }
//         }}
//         onContextMenu={(e) => {
//           e.preventDefault();
//           onDelete(path);
//         }}
//       >
//         {isFolder ? (
//           isOpen ? (
//             <FaFolderOpen className="text-yellow-400" />
//           ) : (
//             <FaFolder className="text-yellow-400" />
//           )
//         ) : (
//           <img src={fileImg} alt="file" className="w-[1rem]" />
//         )}
//         <span>{name}</span>
//         {path !== "" && (
//           <FaTrash
//             className="ml-auto text-red-500 hover:text-red-700"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(path);
//             }}
//           />
//         )}
//       </div>
//       {isFolder && isOpen && (
//         <div className="ml-4 border-l-2 border-gray-600 pl-2">
//           {hasChildren ? (
//             Object.keys(nodes).map((key, index) => (
//               <FileTreeNode
//                 key={index}
//                 name={key}
//                 nodes={nodes[key]}
//                 path={`${path}/${key}`}
//                 onSelect={onSelect}
//                 onDelete={onDelete}
//               />
//             ))
//           ) : (
//             <div className="text-gray-400 italic text-sm px-2 py-1">
//               <span className="text-gray-300">Empty !!</span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const mergeFileTree = (prevTree, newTree) => {
//   console.log("Prev tree->", prevTree);
//   console.log("New tree", newTree);

//   if (!prevTree) return newTree;
//   let mergedTree = { ...prevTree };
//   Object.keys(newTree).forEach((key) => {
//     if (typeof newTree[key] === "object") {
//       mergedTree[key] = mergeFileTree(prevTree[key], newTree[key]);
//     } else {
//       mergedTree[key] = newTree[key];
//     }
//   });
//   console.log("merged tree -> ", mergedTree);
//   return mergedTree;
// };

// const removeFromTree = (tree, pathParts) => {
//   if (!tree || pathParts.length === 0) return tree;
//   let [current, ...remaining] = pathParts;
//   if (remaining.length === 0) {
//     const updatedTree = { ...tree };
//     delete updatedTree[current];
//     return updatedTree;
//   }
//   if (tree[current]) {
//     return {
//       ...tree,
//       [current]: removeFromTree(tree[current], remaining),
//     };
//   }
//   return tree;
// };

// const FileTree = ({ onSelect }) => {
//   const socketRef = useRef(null);
//   const [fileTree, setFileTree] = useState(null);

//   useEffect(() => {
//     const getFileTree = async () => {
//       try {
//         const tree = await getFileTreeStructure();
//         if (!tree || typeof tree !== "object") {
//           console.error("Invalid file tree data:", tree);
//           return;
//         }
//         setFileTree(tree);
//       } catch (error) {
//         console.error("Error fetching file tree:", error);
//       }
//     };
//     getFileTree();
//   }, []);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();
//         if (!socketRef.current) {
//           console.error("Failed to initialize socket connection.");
//           return;
//         }
//         // socketRef.current.on("file:refresh", async (updatedPath) => {
//         //   console.log(`Received 'file:refresh' event for: ${updatedPath}`);
//         //   try {
//         //     const newTree = await getFileTreeStructure(); // Fetch updated files

//         //     setFileTree((prevTree) => mergeFileTree(prevTree, newTree)); // Merge new files into existing state
//         //   } catch (err) {
//         //     console.error("Error fetching updated files:", err);
//         //   }
//         // });

//         socketRef.current.on("file:refresh", async (updatedPath) => {
//           console.log(`Received 'file:refresh' event for: ${updatedPath}`);
//           try {
//             const newTree = await getFileTreeStructure();
//             setFileTree(newTree); // ✅ Fully replace the tree instead of merging
//           } catch (err) {
//             console.error("Error fetching updated files:", err);
//           }
//         });
//         // socketRef.current.on(ACTIONS.FILE_DELETED, (deletedPath) => {
//         //   setFileTree((prevTree) =>
//         //     removeFromTree(prevTree, deletedPath.split("/"))
//         //   );
//         // });
//       } catch (error) {
//         console.error("Error initializing socket:", error);
//       }
//     };
//     init();
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("file:refresh");
//       }
//     };
//   }, []);

//   const handleDelete = async (filePath) => {
//     console.log("path -> ", filePath);
//     if (filePath == "") {
//       alert("Cannot delete the main folder.");
//       return;
//     }
//     try {
//       if (!window.confirm(`Are you sure you want to delete "${filePath}"?`))
//         return;
//       console.log("Deleting file");

//       socketRef.current.emit(ACTIONS.DELETE_FILE, { path: filePath });
//     } catch (error) {
//       console.error("Error deleting file:", error);
//     }
//   };

//   return (
//     <div className="bg-gray-800 w-64 h-full p-3 rounded-md shadow-md overflow-auto">
//       <h3 className="text-lg font-semibold mb-2 text-gray-300">
//         File Explorer
//       </h3>
//       {fileTree ? (
//         <FileTreeNode
//           name="Projects"
//           nodes={fileTree}
//           path=""
//           onSelect={onSelect}
//           onDelete={handleDelete}
//         />
//       ) : (
//         <p className="text-gray-400">Loading files...</p>
//       )}
//     </div>
//   );
// };

// export default FileTree;
