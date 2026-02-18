import { createContext, useContext, useEffect, useRef } from "react";
import { connectSocket } from "../socket/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    // Prevent multiple sockets
    if (socketRef.current) return;

    const socket = connectSocket(accessToken);
    socketRef.current = socket;

    console.log("🟢 Single global socket connected");

    return () => {
      if (socketRef.current) {
        console.log("🔴 Socket disconnected");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
