import { spawn } from "@lydell/node-pty";
import ACTIONS from "../constants/Actions.js"; // Import action constants
import chaukidar from "chokidar";
import fs from "fs/promises"; // ✅ Import the correct module

const userSocketMap = {}; // Store socket-user mappings
const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
const rooms = {}; // { roomId: { history: [], users: Set<socket.id> } }

export function initializeSocket(io) {
  // Function to get all connected clients in a room
  function getAllConnectedClients(roomId) {
    if (!roomId || !io.sockets.adapter.rooms.has(roomId)) return [];
    return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => ({
      socketId,
      email: userSocketMap[socketId] || "Unknown",
    }));
  }

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    /** ───────────────────────────────────────────────
     *  📝 Real-Time Code Collaboration Features
     *  ─────────────────────────────────────────────── */
    socket.on(ACTIONS.JOIN, ({ roomId, email, fullName }) => {
      if (!roomId || !email) return; // Prevent invalid data

      userSocketMap[socket.id] = email;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, {
        clients,
        email,
        socketId: socket.id,
        fullName: fullName,
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
          email: userSocketMap[socket.id] || "Unknown",
        });
      });
    });

    // save to the file
    socket.on(ACTIONS.FILE_CHANGE, async ({ path, content }) => {
      try {
        // console.log("Files to save -> ", content, " Path -> ", path);
        await fs.writeFile(`projects/${path}`, content); // ✅ Corrected FS usage
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
        const fullPath = `projects/${path}`;
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await fs.rm(fullPath, { recursive: true, force: true });
        } else {
          await fs.unlink(fullPath);
        }

        console.log("files deleted successfully");
        // io.emit(ACTIONS.FILE_DELETED, path);

        io.emit("file:refresh");
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });

    /** ───────────────────────────────────────────────
     *  🖥 PowerShell Terminal Integration
     *  ─────────────────────────────────────────────── */
    // console.log("User connected to terminal.");

    try {
      const roomId = socket.handshake.query.roomId;
      // Use PowerShell in Windows, Bash in Linux/Mac
      const shell = process.platform === "win32" ? "powershell.exe" : "bash";

      // // Start PowerShell in the specified directory
      // const ptyProcess = spawn(shell, [], {
      //   name: "xterm-color",
      //   cols: 80,
      //   rows: 24,
      //   cwd: "projects", // Set initial directory
      //   // env: process.env,
      // });

      // // Force PowerShell to switch to D:\
      // if (process.platform === "win32") {
      //   // ptyProcess.write("D:\r\n"); // Switch to C: drive
      //   ptyProcess.write(
      //     `cd "${roomId}"\r\n`
      //   ); // Change to the desired directory
      //   ptyProcess.write("cls\r\n"); // Clear screen for a clean start
      // }

      const ptyProcess = spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: roomId, // Set working directory
        env: process.env,
      });

      // Clear screen at startup
      if (platform === "win32") {
        ptyProcess.write("cls\r\n");
      } else {
        ptyProcess.write("clear\n");
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
    chaukidar.watch("projects").on("all", (event, path) => {
      // console.log(`File ${path} has been ${event}`);
      io.emit("file:refresh", path); // Emitting file-changed event to all connected clients
    });

    //----------------------------------------------------------------------------------------------------

    // Handle user joining a call
    socket.on("join-call", ({ roomId, emailId }) => {
      if (!roomId || !emailId) return;

      console.log(`User -> ${emailId} joined room -> ${roomId}`);

      emailToSocketMapping.set(emailId, socket.id);
      socketToEmailMapping.set(socket.id, emailId);

      socket.join(roomId);

      // Notify other users in the room
      socket.broadcast.to(roomId).emit("joined-call", { emailId });
    });

    socket.on("join-board", ({ roomId, userId }) => {
      // Initialize room if it doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = {
          history: [],
          users: new Map(), // use Map to associate socketId with userId
          cursors: {},
        };
      }

      // Save user to room
      rooms[roomId].users.set(socket.id, userId);
      socket.join(roomId);

      console.log(`User ${userId} joined room: ${roomId}`);

      // Send drawing history only to the new user
      socket.emit("history", { history: rooms[roomId].history });

      // Optional: Notify others that a new user joined (for cursors, presence, etc.)
      socket.to(roomId).emit("user-joined", { userId });
    });

    socket.on("draw", (data) => {
      const { roomId, x0, y0, x1, y1, color } = data;
      if (!rooms[roomId]) return;

      // Save to drawing history
      rooms[roomId].history.push({ x0, y0, x1, y1, color });

      console.log("Drwa -> ", data);

      // Broadcast to others
      socket.to(roomId).emit("draw", data);
    });

    socket.on("undo", ({ roomId, userId }) => {
      socket.to(roomId).emit("undo", { userId });
    });

    socket.on("redo", ({ roomId, userId }) => {
      socket.to(roomId).emit("redo", { userId });
    });

    socket.on("clear-canvas", ({ roomId }) => {
      if (!rooms[roomId]) return;

      rooms[roomId].history = [];
      socket.to(roomId).emit("clear-canvas");
    });

    socket.on("theme-change", ({ roomId, theme, username }) => {
      socket.to(roomId).emit("theme-change", { theme, username });
    });

    socket.on("cursor", (data) => {
      const { roomId, userId } = data;
      if (!rooms[roomId]) return;

      // Update user’s cursor in memory to prevent duplicates
      rooms[roomId].cursors[userId] = data;

      // Emit cursor data to others
      socket.to(roomId).emit("cursor", data);
    });

    socket.on("disconnect", () => {
      const emailId = socketToEmailMapping.get(socket.id);

      if (emailId) {
        emailToSocketMapping.delete(emailId);
      }

      socketToEmailMapping.delete(socket.id);
      console.log("A user disconnected:", socket.id);

      // Iterate through rooms this socket was part of
      const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);

      roomsLeft.forEach((roomId) => {
        const room = rooms[roomId];
        if (room) {
          const userId = room.users.get(socket.id);

          // 🔴 Remove cursor if it exists
          if (userId && room.cursors[userId]) {
            delete room.cursors[userId];

            // Notify others to remove the cursor
            socket.to(roomId).emit("cursor-remove", { userId });
          }

          // Remove user from room map
          room.users.delete(socket.id);

          // 🧹 Clean up room if empty
          if (room.users.size === 0) {
            delete rooms[roomId];
          }
        }
      });
    });

    // socket.on("disconnect", () => {
    //   const emailId = socketToEmailMapping.get(socket.id);

    //   if (emailId) {
    //     emailToSocketMapping.delete(emailId);
    //   }

    //   socketToEmailMapping.delete(socket.id);
    //   console.log("A user disconnected:", socket.id);

    //   // Handle room cleanup
    //   const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);
    //   roomsLeft.forEach((roomId) => {
    //     const room = rooms[roomId];
    //     if (room && io.sockets.adapter.rooms.get(roomId)?.size === 1) {
    //       delete rooms[roomId]; // Clean up if it's the last user in the room
    //     }
    //   });
    // });
  });
}

//----------------------------------------------------------------------================================================================================
