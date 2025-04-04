import { spawn } from "@lydell/node-pty";
import ACTIONS from "../constants/Actions.js"; // Import action constants
import chaukidar from "chokidar";
import fs from "fs/promises"; // ✅ Import the correct module

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
    // console.log(`New user connected: ${socket.id}`);

    /** ───────────────────────────────────────────────
     *  📝 Real-Time Code Collaboration Features
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
      console.log("Code change -> ", code);
      console.log("Room id -> ", roomId);
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

    // save to the file
    socket.on(ACTIONS.FILE_CHANGE, async ({ path, content }) => {
      try {
        // console.log("Files to save -> ", content, " Path -> ", path);
        await fs.writeFile(`./server/projects/${path}`, content); // ✅ Corrected FS usage
        // console.log(`File saved: ./projects/${path}`);
      } catch (error) {
        console.error("Error saving file:", error);
      }
    });

     /** ───────────────────────────────────────────────
     *  🗑️ File Deletion Logic
     *  ─────────────────────────────────────────────── */
     socket.on(ACTIONS.DELETE_FILE, async ({ path }) => {
      try {
        const fullPath = `./server/projects/${path}`;
        const stats = await fs.stat(fullPath);
    
        if (stats.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }
    
        console.log("files deleted successfully")
        // io.emit(ACTIONS.FILE_DELETED, path);

        io.emit("file:refresh");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });

    socket.on("disconnect", () => {
      delete userSocketMap[socket.id];
      // console.log(`User disconnected: ${socket.id}`);
    });

    /** ───────────────────────────────────────────────
     *  🖥 PowerShell Terminal Integration
     *  ─────────────────────────────────────────────── */
    // console.log("User connected to terminal.");

    try {
      // Use PowerShell in Windows, Bash in Linux/Mac
      const shell = process.platform === "win32" ? "powershell.exe" : "bash";

      // Start PowerShell in the specified directory
      const ptyProcess = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: "D:\\", // Set initial directory
        env: process.env,
      });

      // Force PowerShell to switch to D:\
      if (process.platform === "win32") {
        ptyProcess.write("D:\r\n"); // Switch to C: drive
        ptyProcess.write(
          'cd "D:\\Web Development\\compiler\\code\\server\\projects"\r\n'
        ); // Change to the desired directory
        ptyProcess.write("cls\r\n"); // Clear screen for a clean start
      }

      // Send terminal output to frontend
      ptyProcess.onData((data) => {
        socket.emit("output", data);
      });

      // Receive input from frontend
      socket.on("input", (data) => {
        ptyProcess.write(data);
      });

      // Resize terminal
      socket.on("resize", ({ cols, rows }) => {
        ptyProcess.resize(cols, rows);
      });

      // Cleanup on disconnect
      socket.on("disconnect", () => {
        // console.log("User disconnected.");
        ptyProcess.kill();
      });
    } catch (error) {
      console.error("Error initializing terminal:", error);
    }

    // chaukidar
    chaukidar.watch("./server/projects").on("all", (event, path) => {
      // console.log(`File ${path} has been ${event}`);
      io.emit("file:refresh", path); // Emitting file-changed event to all connected clients
    });
  });
}
