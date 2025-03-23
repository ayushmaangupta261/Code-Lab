const userSocketMap = {}; // Store socket-user mappings
import ACTIONS from "../constants/Actions.js"; // Import action constants

export function initializeSocket(io) {
  // Function to get all connected clients in a room
  function getAllConnectedClients(roomId) {
    if (!roomId || !io.sockets.adapter.rooms.has(roomId)) return [];
    return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId) => ({
      socketId,
      userName: userSocketMap[socketId],
    }));
  }

  io.on("connection", (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle user joining a room
    socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
      userSocketMap[socket.id] = userName;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      io.to(roomId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });

    // Handle code changes in a room
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Sync code with a specific user
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Notify others before disconnecting
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          userName: userSocketMap[socket.id],
        });
      });
    });

    // Clean up user mapping on disconnect
    socket.on("disconnect", () => {
      delete userSocketMap[socket.id];
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
