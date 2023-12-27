// import { socket } from "@/libs/socket";
import { TokenContext } from "@/context/TokenProvider";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import ChattingPage from "./ChattingPage";
import CreateMentoringSessionPage from "./CreateMentoringSessionPage";

import Loading from "@/components/atoms/Loading";
import ChatIcon from "@mui/icons-material/Chat";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

const URL = "http://localhost:8080";

let socket: Socket;

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

type DrawerListProps = {
  socket: Socket;
  user: JwtDto;
  sessionList: MentoringSession[];
};

const DrawerList = ({ socket, user, sessionList }: DrawerListProps) => {
  async function enterNew(session_id: number) {
    if (confirm("새로운 모임에 참여하시겠습니까?")) {
      try {
        await socket.emitWithAck("joinSession", {
          session_id,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function enterRoom(session_id: number) {
    socket.emit("changeSession", {
      session_id,
    });
  }

  const publicSessionList = useMemo(
    () => sessionList.filter((session) => !session.is_private),
    [sessionList]
  );
  const privateSessionList = useMemo(
    () =>
      sessionList.filter(
        (session) =>
          session.is_private &&
          session.mentorings.some(
            (mentoring) => mentoring.mentee_id === user.userId
          )
      ),
    [sessionList]
  );

  return (
    <List>
      <Toolbar />
      <Divider sx={{ borderColor: "transparent" }} />
      {sessionList.length === 0 && (
        <ListItem disablePadding>
          <ListItemButton>
            <Typography>등록된 멘토링이 없습니다.</Typography>
          </ListItemButton>
        </ListItem>
      )}
      {publicSessionList.map(({ id, topic, mentorings, messages }, index) => (
        <ListItem key={id} disablePadding>
          <ListItemButton
            onClick={() =>
              mentorings.every((mtr) => mtr.mentee_id !== user.userId)
                ? enterNew(id)
                : enterRoom(id)
            }>
            <ListItemIcon>
              {mentorings.some((mtr) => mtr.mentee_id === user.userId) ? (
                messages.length > 0 &&
                messages.some((msg) =>
                  msg.readedUsers.every((usr) => usr.user_id !== user.userId)
                ) ? (
                  <MarkUnreadChatAltIcon />
                ) : (
                  <ChatIcon />
                )
              ) : (
                <QuestionMarkIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={topic} />
          </ListItemButton>
        </ListItem>
      ))}
      {privateSessionList.length > 0 && <Divider />}
      {privateSessionList.map(({ id, topic, mentorings, messages }, index) => (
        <ListItem key={id} disablePadding>
          <ListItemButton
            onClick={() =>
              mentorings.every((mtr) => mtr.mentee_id !== user.userId)
                ? enterNew(id)
                : enterRoom(id)
            }>
            <ListItemIcon>
              {mentorings.some((mtr) => mtr.mentee_id === user.userId) ? (
                messages.length > 0 &&
                messages.some((msg) =>
                  msg.readedUsers.every((usr) => usr.user_id !== user.userId)
                ) ? (
                  <MarkUnreadChatAltIcon />
                ) : (
                  <ChatIcon />
                )
              ) : (
                <QuestionMarkIcon />
              )}
            </ListItemIcon>
            <ListItemText primary={topic} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

function Index(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerRef = useRef(null);
  const token = useContext(TokenContext);
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [sessionList, setSessionList] = useState<MentoringSession[]>([]);
  const [currentSession, setCurrentSession] = useState<MentoringSession | null>(
    null
  );
  const [userData, setUserData] = useState<JwtDto | null>(null);

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
        socket.emit("initialize");
      } catch (error) {
        console.log(error);
      }
    }

    function onDisconnect() {
      console.log("disconnect");
      setIsConnected(false);
    }

    function onNowSession({ session }: { session: MentoringSession }) {
      setCurrentSession(session);
    }

    function onUpdateSessionList({
      sessionList,
    }: {
      sessionList: MentoringSession[];
    }) {
      setSessionList(sessionList);
    }
    function onUpdateSession({ session }: { session: MentoringSession }) {
      setSessionList((sessionList) => {
        const temp = [...sessionList];
        for (let i = 0; i < temp.length; i++) {
          const item = temp[i];
          if (item.id === session.id) {
            temp.splice(i, 1, session);
            return temp;
          }
        }
        return [...temp, session];
      });
      setCurrentSession((currentSession) => {
        if (currentSession && currentSession.id === session.id) {
          return session;
        }
        return currentSession;
      });
    }

    function onUserData({ user }: { user: JwtDto }) {
      setUserData(user);
    }

    function onReject(rejected: any) {
      // console.log(rejected);
      if (rejected.message === "Session limit exceeded") {
        alert("멘토링 제한 인원에 도달하여 입장 불가합니다.");
      }
    }

    socket.on("connect", onConnect);
    socket.on("sessionList", onUpdateSessionList);
    socket.on("updateSession", onUpdateSession);
    socket.on("userData", onUserData);
    socket.on("nowSession", onNowSession);
    socket.on("reject", onReject);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.disconnect();
      socket.off("connect", onConnect);
      socket.off("sessionList", onUpdateSessionList);
      socket.off("updateSession", onUpdateSession);
      socket.off("userData", onUserData);
      socket.off("nowSession", onNowSession);
      socket.off("reject", onReject);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return userData === null ? (
    <Loading />
  ) : (
    <Stack
      direction='row'
      sx={{ height: "inherit", position: "relative", overflow: "hidden" }}>
      <Box
        component='nav'
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          height: "100%",
        }}
        aria-label='session list'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRightColor: "#565656",
            },
          }}>
          {
            <DrawerList
              socket={socket}
              user={userData}
              sessionList={sessionList}
            />
          }
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRightColor: "#565656",
            },
          }}
          open>
          {
            <DrawerList
              socket={socket}
              user={userData}
              sessionList={sessionList}
            />
          }
        </Drawer>
      </Box>
      {/* mentoring info */}
      {currentSession ? (
        <ChattingPage
          socket={socket}
          user={userData as JwtDto}
          session={currentSession}
          handleDrawerToggle={handleDrawerToggle}
          // sidebar={
          //   <Sidebar
          //     socket={socket}
          //     user={userData as JwtDto}
          //     menuList={sessionList}
          //     button={
          //       <Tooltip placement='right' title={"open"}>
          //         <IconButton size='small'>
          //           <DoubleArrowIcon />
          //         </IconButton>
          //       </Tooltip>
          //     }
          //   />
          // }
        />
      ) : (
        <CreateMentoringSessionPage
          socket={socket}
          isConnected={isConnected}
          handleDrawerToggle={handleDrawerToggle}
          // sidebar={
          //   <Sidebar
          //     socket={socket}
          //     user={userData as JwtDto}
          //     menuList={sessionList}
          //     button={
          //       <Tooltip placement='right' title={"open"}>
          //         <IconButton size='small'>
          //           <DoubleArrowIcon />
          //         </IconButton>
          //       </Tooltip>
          //     }
          //   />
          // }
        />
      )}
    </Stack>
  );
}

export default Index;
