import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { io } from "socket.io-client";
// ✅ Correct
import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./Terminal.css"; // ✅ Custom CSS file

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const socketRef = useRef(null);
  const xtermRef = useRef(null);
  const { roomId } = useParams();

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new Terminal({
      cursorBlink: true,
      theme: { background: "#000", foreground: "#fff" },
      fontSize: 14,
      scrollback: 1000,
    });

    xterm.open(terminalRef.current);
    xtermRef.current = xterm;

    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      query: { roomId },
    });

    socketRef.current = socket;

    xterm.onData((data) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("input", data);
      }
    });

    socket.on("output", (data) => {
      xterm.write(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      xterm.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      className="w-full h-[200px] max-h-[80vh]  overflow-auto  shadow-lg custom-terminal"
    ></div>
  );
};

export default TerminalComponent;
