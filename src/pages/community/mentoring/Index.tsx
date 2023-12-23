import Sidebar from "@/components/moleculars/common/Sidebar";
// import { socket } from "@/libs/socket";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import {
  Badge,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ChattingPage from "./ChattingPage";
import CreateMentoringSessionPage from "./CreateMentoringSessionPage";
import { TokenContext } from "@/context/TokenProvider";
import io, { Socket } from "socket.io-client";

const URL = "http://localhost:8080";

let socket: Socket;

function Index() {
  const token = useContext(TokenContext);
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [sessionList, setSessionList] = useState([]);
  const [currentSession, setCurrentSession] = useState<MentoringSession | null>(
    null
  );
  const [userData, setUserData] = useState<JwtDto | null>(null);
  const [chattings, setChattings] = useState<Message[]>([]);

  useEffect(() => {
    if (token.token) {
      socket = io(URL, {
        path: "/channel",
        auth: {
          token: token.token,
        },
      });
    }

    async function onConnect() {
      console.log("connected");
      setIsConnected(true);
      try {
        console.log("here");
        const { sessions, user } = await socket.emitWithAck(
          "findAllMentoringSession"
        );
        console.log(sessions, user);
        setSessionList(sessions);
        setUserData(user);
      } catch (error) {
        console.log(error);
      }
    }

    function onDisconnect() {
      console.log("disconnect");
      setIsConnected(false);
    }

    function onBroadcast(value: any) {
      console.log(value);
    }

    function onAllMentoringSessions(value: any) {
      console.log("onAllMentoringSessions", value);
    }

    function updateSession({ session }: any) {
      console.log("update session", session);
      setCurrentSession(session);
      // setMentoring(mentoring);
    }

    function enterRoom({ mentoring, session }: any) {
      console.log("enter room value", mentoring, session);
      setCurrentSession(session);
      // setMentoring(mentoring);
    }

    function waitlist(value: any) {}

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("broadcast", onBroadcast);
    socket.on("updateSession", updateSession);
    socket.on("enterRoom", enterRoom);
    socket.on("waitlist", waitlist);
    socket.on("findAllMyMentoringSession", onAllMentoringSessions);

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("broadcast", onBroadcast);
      socket.off("updateSession", updateSession);
      socket.off("enterRoom", enterRoom);
      socket.off("waitlist", waitlist);
      socket.off("findAllMyMentoringSession", onAllMentoringSessions);
    };
  }, []);

  return (
    <Stack
      direction='row'
      sx={{ height: "inherit", position: "relative", overflow: "hidden" }}>
      {/* mentoring info */}
      {currentSession ? (
        <ChattingPage
          socket={socket}
          user={userData as JwtDto}
          session={currentSession}
          sidebar={
            <Sidebar
              socket={socket}
              user={userData as JwtDto}
              menuList={sessionList}
              button={
                <Tooltip placement='right' title={"open"}>
                  <IconButton size='small'>
                    <DoubleArrowIcon />
                  </IconButton>
                </Tooltip>
              }
            />
          }
        />
      ) : (
        <CreateMentoringSessionPage
          socket={socket}
          isConnected={isConnected}
          sidebar={
            <Sidebar
              socket={socket}
              user={userData as JwtDto}
              menuList={sessionList}
              button={
                <Tooltip placement='right' title={"open"}>
                  <IconButton size='small'>
                    <DoubleArrowIcon />
                  </IconButton>
                </Tooltip>
              }
            />
          }
        />
      )}
    </Stack>
  );
}

export default Index;
