// const FileTreeNode = ({ name, nodes }) => {
//   console.log("Rendering:", name, " | Nodes:", nodes);

//   return (
//     <div className="ml-2 ">
//       <p>{name}</p>
//       {nodes && typeof nodes === "object" && Object.keys(nodes).length > 0 ? (
//         <ul className="">
//           {Object.keys(nodes).map((key, index) => (
//             <FileTreeNode key={index} name={key} nodes={nodes[key]} />
//           ))}
//         </ul>
//       ) : (
//         <p>No files</p>
//       )}
//     </div>
//   );
// };

// const FileTree = ({ tree }) => {
//   return <FileTreeNode name="/" nodes={tree || {}} />;
// };

// export default FileTree;


import React, { useState } from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

const FileTreeNode = ({ name, nodes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = nodes && typeof nodes === "object" && Object.keys(nodes).length > 0;

  return (
    <div className="ml-4 text-gray-200 cursor-pointer select-none">
      <div
        className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded-md"
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (isOpen ? <FaFolderOpen className="text-yellow-400" /> : <FaFolder className="text-yellow-400" />) : <FaFile className="text-gray-300" />}
        <span>{name}</span>
      </div>

      {isFolder && isOpen && (
        <div className="ml-4 border-l-2 border-gray-600 pl-2">
          {Object.keys(nodes).map((key, index) => (
            <FileTreeNode key={index} name={key} nodes={nodes[key]} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ tree }) => {
  return (
    <div className="bg-gray-800 w-64 h-full p-3 rounded-md shadow-md overflow-auto">
      <FileTreeNode name="Project" nodes={tree || {}} />
    </div>
  );
};

export default FileTree;

