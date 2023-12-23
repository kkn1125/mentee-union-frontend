import { TokenContext } from "@/context/TokenProvider";
import { useContext, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";

const URL = "http://localhost:8080";

export const SocketConnector = (params: Record<string, string>) => {
  const SearchParams = new URLSearchParams(params);
  return io(URL + (SearchParams ? "?" + SearchParams : ""), {
    path: "/channel",
  });
};

function useSocket() {
  const token = useContext(TokenContext);
  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState(socket?.connected);

  useEffect(() => {
    if (token.token) {
      const conn = SocketConnector({
        token: token.token,
      });
      setSocket(conn);
      setIsConnected(conn.connected);
    }
  }, []);

  const sockets = useMemo(
    () => ({
      socket,
      isConnected,
      setIsConnected,
    }),
    [socket, isConnected, setIsConnected]
  );

  return sockets;
}

export default useSocket;
