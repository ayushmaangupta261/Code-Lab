import React, { useMemo, createContext, useContext as useReactContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// ✅ Correct custom hook name
export const useSocket = () => {
  return useReactContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
