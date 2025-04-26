import React, { useEffect, useRef, useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaTrash,
  FaPlus,
  FaFolderPlus,
  FaEllipsisV,
} from "react-icons/fa";
import {
  getFileTreeStructure,
  deleteFile,
  createFile,
  createFolder,
} from "../../services/operations/codeEditorApi.js";
import { initSocket } from "../../services/socket.js";
import fileImg from "../../assets/Editor/fileImg.png";
import { BsFileEarmarkPlusFill } from "react-icons/bs";

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
      console.log("Full Path -> ", fullPath);

      // Create folder or file based on the flag
      if (isCreatingFolder) {
        await createFolder(fullPath); // Create folder
      } else {
        await createFile(fullPath); // Create file
      }

      // Clear input and hide input field after creation
      setNewItemName("");
      setShowInput(false);

      
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

const FileTree = ({ onSelect, roomId, projectName }) => {
  const socketRef = useRef(null);
  const hasFetchedRef = useRef(false); // For initial file tree fetch
  const hasInitializedSocketRef = useRef(false); // For socket initialization
  const [fileTree, setFileTree] = useState(null);

  // Initial fetch using useRef
  if (!hasFetchedRef.current) {
    hasFetchedRef.current = true;
    (async () => {
      try {
        const tree = await getFileTreeStructure();
        console.log("Fetched file tree:", tree);
        setFileTree(tree);
      } catch (error) {
        console.error("Error fetching file tree:", error);
      }
    })();
  }

  // Socket initialization using useRef
  if (!hasInitializedSocketRef.current) {
    hasInitializedSocketRef.current = true;
    (async () => {
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
    })();
  }

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
        fileTree[roomId] ? (
          <FileTreeNode
            name={projectName}
            nodes={fileTree[roomId]}
            path={roomId}
            onSelect={onSelect}
            onDelete={handleDelete}
            refreshTree={async () => {
              const newTree = await getFileTreeStructure();
              setFileTree(newTree);
            }}
          />
        ) : (
          <p className="text-gray-400">Folder "{roomId}" not found.</p>
        )
      ) : (
        <p className="text-gray-400">Loading files...</p>
      )}
    </div>
  );
};


export default FileTree;  