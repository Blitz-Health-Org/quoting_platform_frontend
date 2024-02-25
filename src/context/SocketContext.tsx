import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { UserContext } from "./UserContext";

type SocketContextProps = {
  socket: Socket | null;
};

// Create a context
export const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

// Export a custom hook to use the context
export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!}/tasks`,
      {
        path: "/socket.io",
        transports: ["websocket"],
      },
    );

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {children}
    </SocketContext.Provider>
  );
}
