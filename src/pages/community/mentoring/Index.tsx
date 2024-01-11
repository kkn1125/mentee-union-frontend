import Loading from "@/components/atoms/common/Loading";
import PublicOrPrivateSessionList from "@/components/atoms/mentoring/PublicSessionList";
import { TokenContext } from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { MODE, SOCKET_URL } from "@/util/global.constants";
import { Box, Divider, Drawer, List, Stack, Toolbar } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import ChattingPage from "./ChattingPage";
import CreateMentoringSessionPage from "./CreateMentoringSessionPage";

interface Props {
  window?: () => Window;
}

type DrawerListProps = {
  socket: Socket;
  user: JwtDto;
  sessionList: MentoringSession[];
  setMobileOpen?: Dispatch<SetStateAction<boolean>>;
};

const drawerWidth = 240;

const drLogger = new Logger("mentoring drawer list");

const DrawerList = memo(
  ({ socket, user, sessionList, setMobileOpen }: DrawerListProps) => {
    const infoRef = useRef<HTMLDivElement>(null);
    const [sessionInfo, setSessionInfo] = useState<MentoringSession | null>(
      null
    );

    useEffect(() => {
      window.addEventListener("click", closeInfoToClick);
      window.addEventListener("keyup", closeInfoToKeyboard);
      return () => {
        window.removeEventListener("click", closeInfoToClick);
        window.removeEventListener("keyup", closeInfoToKeyboard);
      };
    }, []);

    function closeInfoToClick(e: MouseEvent) {
      logger.debug("click event");
      const target = e.target as HTMLDivElement;
      if (target && infoRef.current !== target.closest("#session-info")) {
        setSessionInfo(null);
      }
    }
    function closeInfoToKeyboard(e: KeyboardEvent) {
      if (e.key === "Escape") {
        logger.debug("keyboard event");
        setSessionInfo(null);
      }
    }

    async function enterNew(session_id: number, session: MentoringSession) {
      if (!confirm("새로운 모임에 참여하시겠습니까?")) return;

      try {
        if (
          session.is_private &&
          session.password &&
          session.password.length > 0
        ) {
          const pw = prompt("비밀번호를 입력해주세요.");
          drLogger.debug("check password:", pw);
          const response = await socket.emitWithAck(
            "compareSessionWithPassword",
            {
              session_id,
              password: pw,
            }
          );
          drLogger.debug(response);
          if (response.ok && response.hash === session.password) {
            await socket.emitWithAck("joinSession", {
              session_id,
            });
          } else {
            alert("비밀번호가 틀립니다.");
            drLogger.debug("session pass", session.password);
          }
        } else {
          await socket.emitWithAck("joinSession", {
            session_id,
          });
        }
      } catch (error) {
        drLogger.log(error);
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
      () => sessionList.filter((session) => session.is_private),
      [sessionList]
    );

    return (
      <List>
        <Toolbar />
        <Divider sx={{ borderColor: "transparent" }} />
        <PublicOrPrivateSessionList
          infoRef={infoRef}
          user={user}
          sessionList={publicSessionList}
          enterNew={enterNew}
          enterRoom={enterRoom}
          setMobileOpen={setMobileOpen}
          sessionInfo={sessionInfo}
          setSessionInfo={setSessionInfo}
        />
        {privateSessionList.length > 0 && (
          <Divider
            sx={{
              border: "none",
              borderTopWidth: 3,
              borderTopStyle: "double",
              borderTopColor: "#565656",
            }}
          />
        )}
        <PublicOrPrivateSessionList
          infoRef={infoRef}
          privacy
          user={user}
          sessionList={privateSessionList}
          enterNew={enterNew}
          enterRoom={enterRoom}
          setMobileOpen={setMobileOpen}
          sessionInfo={sessionInfo}
          setSessionInfo={setSessionInfo}
        />
      </List>
    );
  }
);

let socket: Socket;

const logger = new Logger("mentoring index");

function Index(props: Props) {
  const { window: _window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentIsMobile = () => {
    const result = !!navigator.userAgent.match(/mobile|android|iphone/gi);
    logger.info(result);
    return result;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const token = useContext(TokenContext);
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [sessionList, setSessionList] = useState<MentoringSession[]>([]);
  const [currentSession, setCurrentSession] = useState<MentoringSession | null>(
    null
  );
  const [userData, setUserData] = useState<JwtDto | null>(null);

  useEffect(() => {
    if (token.token) {
      socket = io(SOCKET_URL, {
        path: "/channel",
        secure: MODE === "production",
        auth: {
          token: token.token,
        },
      });
    }

    async function onConnect() {
      logger.log("connected");
      setIsConnected(true);
      try {
        socket.emit("initialize");
      } catch (error) {
        logger.log(error);
      }
    }

    function onDisconnect() {
      logger.log("disconnect");
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

    handleDetectMobile();
    window.addEventListener("resize", handleDetectMobile);
    return () => {
      window.removeEventListener("resize", handleDetectMobile);

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

  function handleDetectMobile() {
    setTimeout(() => {
      setIsMobile(currentIsMobile());
    }, 50);
  }

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
        {isMobile ? (
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
                setMobileOpen={setMobileOpen}
              />
            }
          </Drawer>
        ) : (
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
        )}
      </Box>

      {/* mentoring info */}
      {currentSession ? (
        <ChattingPage
          socket={socket}
          user={userData as JwtDto}
          session={currentSession}
          handleDrawerToggle={handleDrawerToggle}
        />
      ) : (
        <CreateMentoringSessionPage
          socket={socket}
          isConnected={isConnected}
          handleDrawerToggle={handleDrawerToggle}
        />
      )}
    </Stack>
  );
}

export default memo(Index);
