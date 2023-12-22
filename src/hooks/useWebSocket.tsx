import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function useWebSocket() {
  const [user, setUser] = useState<User | null>(null);
  const ws = useRef<WebSocket>(null);
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const [socketData, setSocketData] = useState<Partial<MessageEvent<any>>>({});

  useEffect(() => {
    if (user) {
      connect(user);
    }
  }, [user]);

  function connect(user: User) {
    const params = new URLSearchParams({
      uid: "" + user.id,
      e: user.email,
      p: user?.profiles[0]?.new_name || "none",
      u: user.username,
    });
    const websocket = new WebSocket(
      "ws://localhost:8081/mentoring" + "?" + params
    );

    websocket.binaryType = "arraybuffer";
    setup(websocket);
    console.log("connect websocket", websocket);
    Object.assign(ws, { current: websocket });
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

  function disconnect() {
    // NOTICE: 1000은 정상 종료 코드
    console.log("ws disconnect", ws.current);
    ws?.current?.close(1000);
    setUser(null);
    setConnected(false);
  }

  const getWs = useCallback(() => {
    return ws.current;
  }, [ws?.current?.readyState]);

  return [getWs, connected, socketData, setUser, disconnect] as unknown as [
    () => WebSocket,
    boolean,
    Partial<MessageEvent<any>>,
    React.Dispatch<React.SetStateAction<User | null>>,
    () => void
  ];
}

export default useWebSocket;
