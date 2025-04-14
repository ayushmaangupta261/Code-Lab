// import { spawn } from "@lydell/node-pty";
// import ACTIONS from "../constants/Actions.js"; // Import action constants
// import chaukidar from "chokidar";
// import fs from "fs/promises"; // ✅ Import the correct module

// const userSocketMap = {}; // Store socket-user mappings
// const emailToSocketMapping = new Map();
// const socketToEmailMapping = new Map();

// export function initializeSocket(io) {
//   // Function to get all connected clients in a room
//   function getAllConnectedClients(roomId) {
//     if (!roomId || !io.sockets.adapter.rooms.has(roomId)) return [];
//     return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => ({
//       socketId,
//       userName: userSocketMap[socketId] || "Unknown",
//     }));
//   }

//   io.on("connection", (socket) => {
//     // console.log(`New user connected: ${socket.id}`);

//     /** ───────────────────────────────────────────────
//      *  📝 Real-Time Code Collaboration Features
//      *  ─────────────────────────────────────────────── */
//     socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
//       if (!roomId || !userName) return; // Prevent invalid data

//       userSocketMap[socket.id] = userName;
//       socket.join(roomId);

//       const clients = getAllConnectedClients(roomId);
//       io.to(roomId).emit(ACTIONS.JOINED, {
//         clients,
//         userName,
//         socketId: socket.id,
//       });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//       console.log("Code change -> ", code);
//       console.log("Room id -> ", roomId);
//       if (roomId) socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//       if (socketId) io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     // Notify others before disconnecting
//     socket.on("disconnecting", () => {
//       const rooms = [...socket.rooms];
//       rooms.forEach((roomId) => {
//         socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
//           socketId: socket.id,
//           userName: userSocketMap[socket.id] || "Unknown",
//         });
//       });
//     });

//     // save to the file
//     socket.on(ACTIONS.FILE_CHANGE, async ({ path, content }) => {
//       try {
//         // console.log("Files to save -> ", content, " Path -> ", path);
//         await fs.writeFile(`./server/projects/${path}`, content); // ✅ Corrected FS usage
//         // console.log(`File saved: ./projects/${path}`);
//       } catch (error) {
//         console.error("Error saving file:", error);
//       }
//     });

//     /** ───────────────────────────────────────────────
//      *  🗑️ File Deletion Logic
//      *  ─────────────────────────────────────────────── */
//     socket.on(ACTIONS.DELETE_FILE, async ({ path }) => {
//       try {
//         const fullPath = `./server/projects/${path}`;
//         const stats = await fs.stat(fullPath);

//         if (stats.isDirectory()) {
//           await fs.rm(fullPath, { recursive: true, force: true });
//         } else {
//           await fs.unlink(fullPath);
//         }

//         console.log("files deleted successfully");
//         // io.emit(ACTIONS.FILE_DELETED, path);

//         io.emit("file:refresh");
//       } catch (error) {
//         console.error("Error deleting file:", error);
//       }
//     });

//     /** ───────────────────────────────────────────────
//      *  🖥 PowerShell Terminal Integration
//      *  ─────────────────────────────────────────────── */
//     // console.log("User connected to terminal.");

//     try {
//       // Use PowerShell in Windows, Bash in Linux/Mac
//       const shell = process.platform === "win32" ? "powershell.exe" : "bash";

//       // Start PowerShell in the specified directory
//       const ptyProcess = spawn(shell, [], {
//         name: "xterm-color",
//         cols: 80,
//         rows: 24,
//         cwd: "D:\\", // Set initial directory
//         env: process.env,
//       });

//       // Force PowerShell to switch to D:\
//       if (process.platform === "win32") {
//         ptyProcess.write("D:\r\n"); // Switch to C: drive
//         ptyProcess.write(
//           'cd "D:\\Web Development\\compiler\\code\\server\\projects"\r\n'
//         ); // Change to the desired directory
//         ptyProcess.write("cls\r\n"); // Clear screen for a clean start
//       }

//       // Send terminal output to frontend
//       ptyProcess.onData((data) => {
//         socket.emit("output", data);
//       });

//       // Receive input from frontend
//       socket.on("input", (data) => {
//         ptyProcess.write(data);
//       });

//       // Resize terminal
//       socket.on("resize", ({ cols, rows }) => {
//         ptyProcess.resize(cols, rows);
//       });

//       // Cleanup on disconnect
//       socket.on("disconnect", () => {
//         // console.log("User disconnected.");
//         ptyProcess.kill();
//       });
//     } catch (error) {
//       console.error("Error initializing terminal:", error);
//     }

//     // chaukidar
//     chaukidar.watch("./server/projects").on("all", (event, path) => {
//       // console.log(`File ${path} has been ${event}`);
//       io.emit("file:refresh", path); // Emitting file-changed event to all connected clients
//     });

//     //----------------------------------------------------------------------------------------------------

//     // Handle user joining a call
//     socket.on("join-call", ({ roomId, emailId }) => {
//       if (!roomId || !emailId) return;

//       console.log(`User -> ${emailId} joined room -> ${roomId}`);

//       emailToSocketMapping.set(emailId, socket.id);
//       socketToEmailMapping.set(socket.id, emailId);

//       socket.join(roomId);

//       // Notify other users in the room
//       socket.broadcast.to(roomId).emit("joined-call", { emailId });
//     });

//     // Handle call initiation
//     socket.on("call-user", ({ emailId, offer }) => {
//       const toSocketId = emailToSocketMapping.get(emailId);
//       const fromEmail = socketToEmailMapping.get(socket.id);

//       if (!toSocketId || !fromEmail) return;

//       console.log("Call initiated from:", fromEmail, "to:", emailId);

//       io.to(toSocketId).emit("incoming-call", {
//         from: emailId,
//         offer,
//       });
//     });

//     // Handle call acceptance
//     socket.on("call-accepted", ({ emailId, ans }) => {
//       const toSocketId = emailToSocketMapping.get(emailId);
//       if (!toSocketId) return;

//       console.log("Call accepted by:", emailId);

//       io.to(toSocketId).emit("call-accepted", { ans });
//     });

//     // Handle negotiation offer (for ICE renegotiation or screen share, etc.)
//     socket.on("negotiation-offer", ({ emailId, offer }) => {
//       const toSocketId = emailToSocketMapping.get(emailId);
//       const fromEmail = socketToEmailMapping.get(socket.id);

//       if (!toSocketId || !fromEmail) return;

//       console.log(`Negotiation offer from ${fromEmail} to ${emailId}`);

//       io.to(toSocketId).emit("negotiation-offer", {
//         emailId: fromEmail,
//         offer,
//       });
//     });

//     // Handle negotiation answer
//     socket.on("negotiation-answer", ({ emailId, ans }) => {
//       const toSocketId = emailToSocketMapping.get(emailId);
//       if (!toSocketId) return;

//       console.log(`Negotiation answer sent to ${emailId}`);

//       io.to(toSocketId).emit("negotiation-answer", { ans });
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//       const emailId = socketToEmailMapping.get(socket.id);

//       if (emailId) {
//         emailToSocketMapping.delete(emailId);
//       }

//       socketToEmailMapping.delete(socket.id);
//       console.log("A user disconnected:", socket.id);
//     });
//   });
// }

// //----------------------------------------------------------------------================================================================================

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

    // Handle call initiation
    socket.on("call-user", ({ emailId, offer }) => {
      const toSocketId = emailToSocketMapping.get(emailId);
      const fromEmail = socketToEmailMapping.get(socket.id);

      if (!toSocketId || !fromEmail) return;

      console.log("Call initiated from:", fromEmail, "to:", emailId);

      io.to(toSocketId).emit("incoming-call", {
        from: emailId,
        offer,
      });
    });

    // Handle call acceptance
    socket.on("call-accepted", ({ emailId, ans }) => {
      const toSocketId = emailToSocketMapping.get(emailId);
      if (!toSocketId) return;

      console.log("Call accepted by:", emailId);

      io.to(toSocketId).emit("call-accepted", { ans });
    });

    // Handle negotiation offer (for ICE renegotiation or screen share, etc.)
    socket.on("negotiation-offer", ({ emailId, offer }) => {
      const toSocketId = emailToSocketMapping.get(emailId);
      const fromEmail = socketToEmailMapping.get(socket.id);

      if (!toSocketId || !fromEmail) return;

      console.log(`Negotiation offer from ${fromEmail} to ${emailId}`);

      io.to(toSocketId).emit("negotiation-offer", {
        emailId: fromEmail,
        offer,
      });
    });

    // Handle negotiation answer
    socket.on("negotiation-answer", ({ emailId, ans }) => {
      const toSocketId = emailToSocketMapping.get(emailId);
      if (!toSocketId) return;

      console.log(`Negotiation answer sent to ${emailId}`);

      io.to(toSocketId).emit("negotiation-answer", { ans });
    });

    // Whiteboard
    socket.on("join-whiteboard", ({ roomId, userId }) => {
      // Ensure the room exists or initialize it
      console.log("joining white-board -> ", roomId);
      console.log("joining white-board -> ", userId);
      if (!rooms[roomId]) {
        rooms[roomId] = { history: [], users: new Set() };
      }

      // Add user to the room's user set
      rooms[roomId].users.add(socket.id);

      // Join the room
      socket.join(roomId);

      // console.log(`User ${userId} joined room: ${roomId}`);

      console.log("User -> ", userId, " joined -> ", roomId);

      const yourHistoryData = rooms[roomId].history;
      socket.emit("history", { history: yourHistoryData });

      // console.log("history -> ", yourHistoryData);
    });

    socket.on("draw", (data) => {
      const { roomId, x0, y0, x1, y1, color } = data;
      // console.log("Draw -> ",roomId)

      if (!rooms[roomId]) return;

      // Save to room history
      rooms[roomId].history.push({ x0, y0, x1, y1, color });

      // Broadcast drawing data to other users in the room
      socket.to(roomId).emit("draw", data);
    });

    // Handling 'undo' event
    socket.on("undo", (data) => {
      // Broadcast the undo action to all other clients
      socket.broadcast.emit("undo", data);
    });

    // Handling 'redo' event
    socket.on("redo", (data) => {
      // Broadcast the redo action to all other clients
      socket.broadcast.emit("redo", data);
    });

    socket.on("clear-canvas", ({ roomId }) => {
      if (!rooms[roomId]) return;

      // Clear room history
      rooms[roomId].history = [];

      // Broadcast clear canvas event to other users in the room
      socket.to(roomId).emit("clear-canvas");
    });

    socket.on("theme-change", ({ roomId, theme, userName }) => {
      socket.to(roomId).emit("theme-change", { theme, userName });
    });

    socket.on("cursor", (data) => {
      // console.log("cursor -> ",data.roomId)
      const { roomId } = data.roomId;
      socket.to(roomId).emit("cursor", data);
    });

    // Handle disconnect
    // socket.on("disconnect", () => {
    //   const emailId = socketToEmailMapping.get(socket.id);

    //   if (emailId) {
    //     emailToSocketMapping.delete(emailId);
    //   }

    //   socketToEmailMapping.delete(socket.id);
    //   console.log("A user disconnected:", socket.id);
    // });

    socket.on("disconnect", () => {
      const emailId = socketToEmailMapping.get(socket.id);

      if (emailId) {
        emailToSocketMapping.delete(emailId);
      }

      socketToEmailMapping.delete(socket.id);
      console.log("A user disconnected:", socket.id);

      // Handle room cleanup
      const roomsLeft = Array.from(socket.rooms).filter((r) => r !== socket.id);
      roomsLeft.forEach((roomId) => {
        const room = rooms[roomId];
        if (room && io.sockets.adapter.rooms.get(roomId)?.size === 1) {
          delete rooms[roomId]; // Clean up if it's the last user in the room
        }
      });
    });
  });
}

//----------------------------------------------------------------------================================================================================
