// import React, { useEffect, useRef, useState } from "react";
// import Client from "../components/Editor/Client.jsx";
// import Editor from "../components/Editor/Editor.jsx";
// import FileTree from "../components/Terminal/FileTree.jsx";
// import { getFiles } from "../services/operations/codeEditorApi.js";
// import { initSocket } from "../services/socket.js";
// import ACTIONS from "../constants/Actions.js";
// import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import TerminalComponent from "../components/Terminal/Terminal.jsx";

// const EditorPage = () => {
//   const socketRef = useRef(null);
//   const location = useLocation();
//   const codeRef = useRef(null);
//   const ReactNavigate = useNavigate();
//   const fileTreeRef = useRef(null);
//   const [refresh, setRefresh] = useState(false);
//   const { roomId } = useParams();
//   const [clients, setClients] = useState([]);

//   /** ───────────────────────────────────────────────
//    *  Fetch File Tree
//    *  ─────────────────────────────────────────────── */
//   const getFileTree = async () => {
//     try {
//       const tree = await getFiles();
//       console.log("File tree in UI ->", tree);
//       fileTreeRef.current = tree;
//       setRefresh((prev) => !prev);
//     } catch (error) {
//       console.error("Error fetching file tree:", error);
//     }
//   };

//   useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on("file:refresh", getFileTree);
//     }
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off("file:refresh", getFileTree);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     getFileTree();
//   }, [roomId]);

//   /** ───────────────────────────────────────────────
//    *  Initialize Socket Connection
//    *  ─────────────────────────────────────────────── */
//   useEffect(() => {
//     const init = async () => {
//       try {
//         socketRef.current = await initSocket();

//         if (!socketRef.current) {
//           toast.error("❌ Failed to connect to the socket server.");
//           return;
//         }

//         socketRef.current.on("connect", () => {
//           console.log("✅ Socket connected successfully.");
//         });

//         socketRef.current.on("connect_error", handleErrors);
//         socketRef.current.on("connect_failed", handleErrors);

//         function handleErrors(err) {
//           console.error("Socket Error:", err);
//           toast.error("Socket connection failed, try again later..");
//           ReactNavigate("/");
//         }

//         // ✅ Join Room only when socket is connected
//         socketRef.current.emit(ACTIONS.JOIN, {
//           roomId,
//           userName: location.state?.userName,
//         });

//         // ✅ Ensure socket exists before adding listeners
//         if (socketRef.current) {
//           socketRef.current.on(ACTIONS.JOINED, ({ clients, userName, socketId }) => {
//             if (userName !== location.state?.userName) {
//               toast.success(`${userName} joined the room.`);
//             }
//             setClients(clients);

//             // ✅ Ensure socket exists before emitting
//             if (socketRef.current) {
//               socketRef.current.emit(ACTIONS.SYNC_CODE, {
//                 code: codeRef.current,
//                 socketId,
//               });
//             }
//           });

//           socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
//             toast.success(`${userName} left the room.`);
//             setClients((prev) =>
//               prev.filter((client) => client.socketId !== socketId)
//             );
//           });
//         }
//       } catch (error) {
//         console.error("Error initializing socket:", error);
//         toast.error("Failed to initialize socket connection.");
//       }
//     };

//     init();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current.off(ACTIONS.JOINED);
//         socketRef.current.off(ACTIONS.DISCONNECTED);
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, []);

//   /** ───────────────────────────────────────────────
//    *  Copy Room ID to Clipboard
//    *  ─────────────────────────────────────────────── */
//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success("Room ID copied!");
//     } catch (error) {
//       toast.error("Could not copy the Room ID");
//     }
//   };

//   /** ───────────────────────────────────────────────
//    *  Leave Room and Navigate Back
//    *  ─────────────────────────────────────────────── */
//   const leaveRoom = () => {
//     ReactNavigate("/");
//   };

//   if (!location.state) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="mainwrap text-gray-100 flex h-[39rem] w-full gap-x-3 mt-[4rem] overflow-hidden">
//       {/* Left Sidebar - File Tree & Controls */}
//       <div className="aside flex flex-col justify-between bg-gray-700 py-5 px-5 rounded-br-2xl rounded-tr-2xl w-[18rem]">
//         <div>
//           <FileTree tree={fileTreeRef.current} key={refresh} />
//         </div>

//         {/* Copy & Leave Buttons */}
//         <div className="flex flex-col w-[15rem]">
//           <button
//             className="btn copyBtn px-2 py-1 bg-gray-200 text-black ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:scale-105 duration-200 w-full"
//             onClick={copyRoomId}
//           >
//             Copy Room ID
//           </button>
//           <button
//             className="btn leaveBtn px-2 py-1 bg-green-500 text-black ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200 w-full"
//             onClick={leaveRoom}
//           >
//             Leave the Room
//           </button>
//         </div>
//       </div>

//       {/* Right Section - Code Editor & Terminal */}
//       <div className="editorwrap w-[90%] mr-5 mb-4 mt-1">
//         <div className="h-[60%]">
//           <Editor
//             socketRef={socketRef}
//             roomId={roomId}
//             onCodeChange={(code) => {
//               codeRef.current = code;
//             }}
//           />
//         </div>

//         <div>
//           <TerminalComponent />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditorPage;

// // sample
// // import React, { useEffect, useRef } from "react";
// // import { useState } from "react";
// // import Client from "../components/Editor/Client.jsx";
// // import Editor from "../components/Editor/Editor.jsx";
// // import FileTree from "../components/Terminal/FileTree.jsx";
// // import { getFiles } from "../services/operations/codeEditorApi.js";

// // import { initSocket } from "../services/socket.js";
// // import ACTIONS from "../constants/Actions.js";
// // import {
// //   Navigate,
// //   useLocation,
// //   useNavigate,
// //   useParams,
// // } from "react-router-dom";
// // import toast from "react-hot-toast";
// // import TerminalComponent from "../components/Terminal/Terminal.jsx";

// // const EditorPage = () => {
// //   const socketRef = useRef(null); // It won't re-render our component
// //   const location = useLocation();
// //   const codeRef = useRef(null);
// //   const ReactNavigate = useNavigate();

// //   const { roomId } = useParams();
// //   // console.log("Room id -> ", roomId);

// //   const [clients, setClients] = useState([]);

// //   const [fileTree, setFileTree] = useState(null); // ✅ Use state instead of ref

// //   const getFileTree = async () => {
// //     const tree = await getFiles();
// //     console.log("File tree in UI ->", tree);
// //     setFileTree(tree); // ✅ Trigger re-render
// //   };

// //   useEffect(() => {
// //     getFileTree();
// //   }, [roomId]); // ✅ Fetch data when roomId changes

// //   useEffect(() => {
// //     const init = async () => {
// //       socketRef.current = await initSocket();

// //       socketRef.current.on("connect_error", (err) => handleErrors(err));
// //       socketRef.current.on("connect_failed", (err) => handleErrors(err));

// //       function handleErrors(e) {
// //         // console.log("Socket-Error");
// //         toast.error("Socket connection failed, try again later..");
// //         ReactNavigate("/");
// //       }

// //       // Join room
// //       socketRef.current.emit(ACTIONS.JOIN, {
// //         roomId,
// //         userName: location.state?.userName,
// //       });

// //       if (socketRef.current) {
// //         socketRef.current.on(
// //           ACTIONS.JOINED,
// //           ({ clients, userName, socketId }) => {
// //             if (userName !== location.state?.userName) {
// //               toast.success(`${userName} joined the room.`);
// //               // console.log(`${userName} joined`);
// //             }
// //             setClients(clients);

// //             if (socketRef.current) {
// //               socketRef.current.emit(ACTIONS.SYNC_CODE, {
// //                 code: codeRef.current,
// //                 socketId,
// //               });
// //             }
// //           }
// //         );
// //       }

// //       // Listening for disconnected
// //       socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
// //         toast.success(`${userName} left the room.`);
// //         setClients((prev) => {
// //           return prev.filter((client) => client.socketId !== socketId);
// //         });
// //       });
// //     };

// //     init(); // ✅ Call the async function properly

// //     // Cleanup function
// //     return () => {
// //       if (socketRef.current) {
// //         socketRef.current.disconnect();
// //         socketRef.current.off(ACTIONS.JOINED);
// //         socketRef.current.off(ACTIONS.DISCONNECTED);
// //         socketRef.current.off(ACTIONS.CODE_CHANGE);
// //       }
// //     };
// //   }, []); // ✅ Dependencies array remains empty

// //   //copy room id
// //   const copyRoomId = async () => {
// //     try {
// //       await navigator.clipboard.writeText(roomId);
// //       toast.success("Room Id copied");
// //     } catch (error) {
// //       toast.error("Could not copy the room Id");
// //       // console.log("Error in room id copy -> ", error);
// //     }
// //   };

// //   // leave room
// //   const leaveRoom = () => {
// //     ReactNavigate("/");
// //   };

// //   if (!location.state) {
// //     <Navigate to="/" />;
// //   }

// //   return (
// //     <div className="mainwrap text-gray-100 flex h-[39rem] w-full gap-x-3 mt-[4rem] overflow-hidden ">
// //       <div className="aside flex flex-col justify-between bg-gray-700 py-5 px-5 rounded-br-2xl rounded-tr-2xl w-[18rem]">
// //         <div>
// //           <FileTree tree={fileTree} />
// //         </div>

// //         {/* copy and leave */}
// //         <div className=" flex flex-col w-[15rem]">
// //           <button
// //             className="btn copyBtn px-2 py-1 bg-gray-200 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:scale-105 duration-200 w-full"
// //             onClick={copyRoomId}
// //           >
// //             Copy Room Id
// //           </button>
// //           <button
// //             className="btn leaveBtn px-2 py-1 bg-green-500 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200 w-full"
// //             onClick={leaveRoom}
// //           >
// //             Leave the Room
// //           </button>
// //         </div>
// //       </div>

// //       <div className="editorwrap w-[90%] mr-5 mb-4 mt-1 ">
// //         <div className="h-[60%]">
// //           <Editor
// //             socketRef={socketRef}
// //             roomId={roomId}
// //             onCodeChange={(code) => {
// //               codeRef.current = code;
// //             }}
// //           />
// //         </div>

// //         <div className="">
// //           <TerminalComponent />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EditorPage;

import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Editor/Client.jsx";
import Editor from "../components/Editor/Editor.jsx";
import { initSocket } from "../services/socket.js";
import ACTIONS from "../constants/Actions.js";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import TerminalComponent from "../components/Terminal/Terminal.jsx";
import FileTree from "../components/Terminal/FileTree.jsx";
import fileImg from "../assets/Editor/fileImg.png";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const ReactNavigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  /** ───────────────────────────────────────────────
   *  Initialize Socket Connection
   *  ─────────────────────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        if (!socketRef.current) {
          toast.error("❌ Failed to connect to the socket server.");
          return;
        }

        socketRef.current.on("connect", () => {
          console.log("✅ Socket connected successfully.");
        });

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        function handleErrors(err) {
          console.error("Socket Error:", err);
          toast.error("Socket connection failed, try again later..");
          ReactNavigate("/");
        }

        // ✅ Join Room only when socket is connected
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          userName: location.state?.userName,
        });

        // ✅ Ensure socket exists before adding listeners
        if (socketRef.current) {
          socketRef.current.on(
            ACTIONS.JOINED,
            ({ clients, userName, socketId }) => {
              if (userName !== location.state?.userName) {
                toast.success(`${userName} joined the room.`);
              }
              setClients(clients);

              // ✅ Ensure socket exists before emitting
              if (socketRef.current) {
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                  code: codeRef.current,
                  socketId,
                });
              }
            }
          );

          socketRef.current.on(
            ACTIONS.DISCONNECTED,
            ({ socketId, userName }) => {
              toast.success(`${userName} left the room.`);
              setClients((prev) =>
                prev.filter((client) => client.socketId !== socketId)
              );
            }
          );
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
        toast.error("Failed to initialize socket connection.");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, []);

  /** ───────────────────────────────────────────────
   *  Copy Room ID to Clipboard
   *  ─────────────────────────────────────────────── */
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied!");
    } catch (error) {
      toast.error("Could not copy the Room ID");
    }
  };

  /** ───────────────────────────────────────────────
   *  Leave Room and Navigate Back
   *  ─────────────────────────────────────────────── */
  const leaveRoom = () => {
    ReactNavigate("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const [selectedFile, setSelectedFile] = useState("");

  console.log(`Se;lected file ${selectedFile}`)

  return (
    <div className="mainwrap text-gray-100 flex h-[39rem] w-full gap-x-3 mt-[4rem] overflow-hidden ">
      <div className="aside flex flex-col justify-between  bg-gray-700 py-5 px-5 rounded-br-2xl rounded-tr-2xl w-[19%]">
        {/* Styled Selected File Display */}
        <div className="flex flex-col gap-y-3 mx-auto">
          <div>
            <FileTree onSelect={(path) => setSelectedFile(path)} />
          </div>
        </div>

        {/* copy and leave */}
        <div className=" flex flex-col w-[15rem]">
          <button
            className="btn copyBtn px-2 py-1 bg-gray-200 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:scale-105 duration-200 w-full"
            onClick={copyRoomId}
          >
            Copy Room Id
          </button>
          <button
            className="btn leaveBtn px-2 py-1 bg-green-500 text-black  ml-auto rounded-lg mt-2 mb-2 cursor-pointer hover:bg-green-400 hover:scale-105 duration-200 w-full"
            onClick={leaveRoom}
          >
            Leave the Room
          </button>
        </div>
      </div>

      <div className="editorwrap w-[80%]  flex flex-col justify-between">
        {/* working directory */}
        <div className="bg-gray-800 w-[1202px] px-4 py-2 rounded-md text-gray-200 font-semibold flex items-center gap-2 shadow-md">
          <span className="text-yellow-400">
            {selectedFile && <img src={fileImg} alt="" className="w-[1rem]" />}
          </span>
          <p className="truncate w-full">
            {selectedFile.replaceAll("/", " > ") || (
              <p>
                No file selected, <span className="text-amber-300">Please select a file !</span>
              </p>
            )}
          </p>
        </div>

        <div className=" flex flex-col rounded-lg  ">
          {/* Code Editor */}
          <div className="border border-amber-200 w-[1202px] mt-1">
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              selectedFile={selectedFile}
            />
          </div>
        </div>

        {/* Terminal */}
        <div className="">
          <TerminalComponent />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
