import { spawn } from "@lydell/node-pty";
import ACTIONS from "../constants/Actions.js"; // Import action constants

const userSocketMap = {}; // Store socket-user mappings

export function initializeSocket(io) {
  // Function to get all connected clients in a room
  function getAllConnectedClients(roomId) {
    if (!roomId || !io.sockets.adapter.rooms.has(roomId)) return [];
    return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => ({
      socketId,
      userName: userSocketMap[socketId] || "Unknown",
    }));
  }

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    /** ───────────────────────────────────────────────
     *  Real-Time Collaboration Features
     *  ─────────────────────────────────────────────── */
    socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
      if (!roomId || !userName) return; // Prevent invalid data

      userSocketMap[socket.id] = userName;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      if (roomId) socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      if (socketId) io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Notify others before disconnecting
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          userName: userSocketMap[socket.id] || "Unknown",
        });
      });
    });

    socket.on("disconnect", () => {
      delete userSocketMap[socket.id];
      console.log(`User disconnected: ${socket.id}`);
    });

    /** ───────────────────────────────────────────────
     *  PowerShell Terminal Integration
     *  ─────────────────────────────────────────────── */
    console.log("User connected to terminal.");

    try {
      // Use PowerShell in Windows, Bash in Linux/Mac
      const shell = process.platform === "win32" ? "powershell.exe" : "bash";

      // Start PowerShell in the specified directory
      const ptyProcess = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: "D:\\Web Development\\compiler\\code\\server\\temp", // ✅ Initial directory
        env: process.env,
      });

      // Ensure PowerShell is set to the correct directory
      if (process.platform === "win32") {
        ptyProcess.write('cd "D:\\Web Development\\compiler\\code\\server\\temp"\r\n');
        ptyProcess.write("cls\r\n"); // Clear screen
      }

      // Send terminal output to frontend
      ptyProcess.onData((data) => {
        if (socket.connected) {
          socket.emit("output", data);
        }
      });

      // Receive input from frontend
      socket.on("input", (data) => {
        try {
          ptyProcess.write(data);
        } catch (error) {
          console.error("Error writing to terminal:", error);
        }
      });

      // Resize terminal
      socket.on("resize", ({ cols, rows }) => {
        try {
          if (cols && rows) {
            ptyProcess.resize(cols, rows);
          }
        } catch (error) {
          console.error("Error resizing terminal:", error);
        }
      });

      // Cleanup on disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected from terminal.");
        try {
          ptyProcess.kill();
        } catch (error) {
          console.error("Error killing terminal process:", error);
        }
      });
    } catch (error) {
      console.error("Error initializing terminal:", error);
    }
  });
}
