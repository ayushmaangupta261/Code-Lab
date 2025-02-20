// import { io } from "socket.io-client";

// export const initSocket = async () => {
//   const options = {
//     "force new connection": true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     transports: ["websocket"],
//   };

//   console.log("Url -> ", import.meta.env.VITE_APP_BASE_URL);

//   return io(import.meta.env.VITE_APP_BASE_URL, options);
// };

import { io } from "socket.io-client";

export const initSocket = async () => {
  const BASE_URL =
    import.meta.env.VITE_APP_SOCKET_URL || "http://localhost:5000";

  const options = {
    forceNew: true, // Corrected key
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    transports: ["websocket"],
  };

  // console.log("Connecting to Socket.io server at:", BASE_URL);

  try {
    const socket = io(BASE_URL, options);
    return socket;
  } catch (error) {
    console.error("Socket connection error:", error);
    return null;
  }
};
