import React, { useEffect, useState } from "react";

function useWebSocket() {
  const [user, setUser] = useState<User | null>(null);
  const [ws, setWs] = useState<WebSocket>();
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const [socketData, setSocketData] = useState<Partial<MessageEvent<any>>>({});

  useEffect(() => {
    if (user) {
      connect(user);
    }
    return () => {
      if (ws) {
        disconnect(ws);
      }
    };
  }, [user]);

  function connect(user: User) {
    const params = new URLSearchParams({
      uid: "" + user.id,
      e: user.email,
      p: user?.profiles[0]?.new_name || "none",
    });
    const websocket = new WebSocket(
      "ws://localhost:8081/mentoring" + "?" + params
    );
    setup(websocket);
    setWs(websocket);
  }

  function setup(socket: WebSocket) {
    socket.onopen = onOpen;
    socket.onmessage = onMessage;
    socket.onerror = onError;
    socket.onclose = onClose;
  }

  function onOpen() {
    console.log("connected!");
    // alert("멘토링 채널에 연결되었습니다!");
    setConnected(true);
  }

  function onMessage(message: MessageEvent<any>) {
    setSocketData(message);
  }

  function onError(err: Event) {
    console.error("error", err);
    setUser(null);
    setConnected(false);
  }

  function onClose() {
    console.log("disconnected!");
    setUser(null);
    setConnected(false);
  }

  function disconnect(ws: WebSocket) {
    // NOTICE: 1000은 정상 종료 코드
    ws?.close(1000);
    setUser(null);
    setConnected(false);
  }

  return [ws, connected, socketData, setUser, disconnect] as [
    WebSocket,
    boolean,
    Partial<MessageEvent<any>>,
    React.Dispatch<React.SetStateAction<User | null>>,
    (ws: WebSocket) => void
  ];
}

export default useWebSocket;
