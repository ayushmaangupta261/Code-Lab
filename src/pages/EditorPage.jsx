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
import LiveMeet from "../components/Terminal/LiveMeet.jsx";





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
  const [showMenu, setShowMenu] = useState("clients");

  const handleMenuToggle = (menu) => {
    console.log("handleMenuToggle , ", menu);
    setShowMenu(menu);
  };

  console.log(`Selected file ${selectedFile}`);

  return (
    <div className="mainwrap text-gray-100 flex  w-full gap-x-3 mt-[4rem] overflow-hidden h-[85vh] ">
      
      <div className="aside flex flex-col justify-between items-center  bg-gray-700 py-5 px-5 rounded-2xl  w-[19vw]">
        {/* Styled Selected File Display */}
        <div className="flex flex-col gap-y-3 mx-auto items-center w-full">
          {/* menu toggle */}
          <div className="w-[16rem] py-1 px-1 flex justify-between bg-gray-800 rounded-md overflow-x-auto scrollbar-none">
            {/* Clients */}
            <button
              className={`w-[4rem] text-center px-2 py-1 rounded-md hover:scale-105 transition-all duration-300
          ${
            showMenu === "clients"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-black"
          }`}
              onClick={() => handleMenuToggle("clients")}
            >
              Clients
            </button>

            {/* Files */}
            <button
              className={`w-[4rem] text-center px-2 py-1 rounded-md hover:scale-105 transition-all duration-300
          ${
            showMenu === "files"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-black"
          }`}
              onClick={() => handleMenuToggle("files")}
            >
              Files
            </button>

            {/* Live */}
            <button
              className={`w-[4rem] text-center px-2 py-1 rounded-md hover:scale-105 transition-all duration-300
          ${
            showMenu === "live-meet"
              ? "bg-green-700 text-white "
              : "bg-green-500 text-black"
          }`}
              onClick={() => handleMenuToggle("live-meet")}
            >
              Live
            </button>
          </div>
          {/* show menu */}
          <div className="w-[16rem] overflow-y-auto">
            
          <div className="flex gap-x-2 flex-wrap mx-auto bg-gray-800 px-2 rounded-md">
              {/* files */}
              {showMenu === "files" && (
                <FileTree onSelect={(path) => setSelectedFile(path)} />
              )}
            </div>
            {/* clients */}
            <div className="flex gap-x-2 flex-wrap mx-auto bg-gray-800 px-2 rounded-md">
              {showMenu === "clients" &&
                clients.map((client) => (
                  <Client userName={client.userName} key={client.socketId} />
                ))}
            </div>
            {/* Video chat */}
            <div className="flex gap-x-2 flex-wrap mx-auto bg-gray-800 px-2 rounded-md">
              {showMenu === "live-meet" && <LiveMeet />}
            </div>
          </div>
        </div>

        {/* copy and leave */}
        <div className=" flex flex-col w-[15rem] items-center">
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
                No file selected,{" "}
                <span className="text-amber-300">Please select a file !</span>
              </p>
            )}
          </p>
        </div>

        {/* Code Editor */}
        <div className=" flex flex-col rounded-lg h-[50vh] mt-1 mb-1 border-amber-300 w-[79vw]">
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              selectedFile={selectedFile}
            />
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
