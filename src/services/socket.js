import { io } from "socket.io-client";

export const initSocket = async () => {
  const BASE_URL =
    import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:4000";

  const options = {
    forceNew: true, 
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket"],
  };
 
  try {
    const socket = io(BASE_URL, options);

    // ✅ Ensure the socket is fully connected before returning
    await new Promise((resolve, reject) => {
      socket.on("connect", () => {
        console.log("✅ Socket connected to", BASE_URL);
        resolve();
      });

      socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        reject(error);
      });
    });

    return socket;
  } catch (error) {
    console.error("❌ Socket connection failed:", error);
    return null;
  }
};
