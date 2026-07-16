import { io } from "socket.io-client";

let socket;

export const connectSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;
