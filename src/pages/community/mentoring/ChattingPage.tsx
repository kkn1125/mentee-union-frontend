import { timeFormat } from "@/util/tool";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

type ChattingPageProps = {
  socket: Socket;
  handleDrawerToggle: () => void;
  user: JwtDto;
  session: MentoringSession;
};

function ChattingPage({
  socket,
  handleDrawerToggle,
  user,
  session,
}: ChattingPageProps) {
  const [changeSession, setChangeSession] = useState<MentoringSession | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [chattings, setChattings] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chattingRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState(false);
  const [ignoreChatScroll, setIgnoreChatScroll] = useState(false);

  useEffect(() => {
    chattingWindowScrolldown(true);
    setTimeout(() => {
      setInitialized(true);
      inputRef.current?.focus();
    }, 50);

    if (chattingRef.current) {
      chattingRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      chattingRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [changeSession]);

  useEffect(() => {
    setChattings(session.messages);
    chattingWindowScrolldown();
    setChangeSession((changeSession) => {
      if (changeSession?.id !== session.id) {
        setInitialized(false);
        return session;
      }
      return changeSession;
    });
  }, [session]);

  function handleScroll(e: Event) {
    const target = e.target as HTMLDivElement;
    const scrollBottomLine = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;
    const limitGap = 200;
    const gap = Math.abs(scrollBottomLine - scrollHeight);
    if (limitGap < gap) {
      setIgnoreChatScroll(true);
    } else {
      setIgnoreChatScroll(false);
      setNewMessage(false);
    }
  }

  function chattingWindowScrollForceDown() {
    setTimeout(() => {
      const current = chattingRef.current;
      if (current !== null) {
        current.scrollTo({
          behavior: "smooth",
          left: 0,
          top: current.scrollHeight,
        });
      }
    }, 100);
  }

  function chattingWindowScrolldown(direct: boolean = false) {
    if (ignoreChatScroll) {
      setNewMessage(true);
      return;
    }
    setTimeout(() => {
      const current = chattingRef.current;
      if (current !== null) {
        current.scrollTo({
          behavior: direct ? "instant" : "smooth",
          left: 0,
          top: current.scrollHeight,
        });
      }
    }, 100);
  }

  function clearInputValue() {
    setInputValue("");
  }

  function sendChat() {
    if (inputValue !== "") {
      socket.emit("saveMessage", {
        session_id: session.id,
        message: inputValue,
      });
    }
    inputRef.current?.focus();
  }

  function handleWaitList() {
    socket.emit("waitlist", {
      session_id: session.id,
    });
  }

  function handleOutSession() {
    socket.emit("outSession", {
      session_id: session.id,
    });
  }

  function handleInputValue(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }

  function handleRemoveChat(message_id: number) {
    if (
      confirm(
        "대화 중인 사용자에게 삭제된 메세지로 안내되며, 복구가 불가능합니다.\n선택한 메세지를 삭제하시겠습니까?"
      )
    ) {
      socket.emit("deleteMessage", { session_id: session.id, message_id });
    } else {
      // nothing to do
    }
  }

  return (
    <Stack flex={1} sx={{ height: "inherit" }}>
      <Stack
        direction='row'
        alignItems='center'
        gap={1}
        sx={{ p: 2, minHeight: 66 }}>
        <Stack
          flex={1}
          direction='row'
          justifyContent={"space-between"}
          alignItems='center'
          gap={3}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Button
              variant='contained'
              color='warning'
              onClick={handleWaitList}>
              대기열
            </Button>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}>
              <MenuIcon />
            </IconButton>
            <Tooltip
              title={`참여 인원: ${session.mentorings.length}명`}
              placement='right'>
              <Badge color={"info"} badgeContent={session.mentorings.length}>
                <GroupIcon />
              </Badge>
            </Tooltip>
          </Box>
          <Typography>{session.topic}</Typography>
          <Button variant='contained' color='error' onClick={handleOutSession}>
            나가기
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ borderColor: "#565656" }} />
      <Stack
        ref={chattingRef}
        flex={1}
        gap={2}
        sx={{
          p: 2,
          overflow: "auto",
          opacity: initialized ? 1 : 0,
          transition: "150ms ease-in-out 150ms",
          "&::-webkit-scrollbar": {
            width: 3,
            height: 3,
            backgroundColor: "background.default",
            opacity: "inherit",
            transition: "inherit",
          },
          "&::-webkit-scrollbar-thumb": {
            width: 3,
            height: 3,
            backgroundColor: "text.primary",
            opacity: "inherit",
            transition: "inherit",
          },
        }}>
        <Box>
          {chattings.map((chat, index) =>
            chat.user_id === null ? (
              <Alert
                key={chat.id}
                color='success'
                sx={{
                  mb: 2,
                }}>
                <AlertTitle>{"[System]"}</AlertTitle>
                {chat.message}
              </Alert>
            ) : (
              <Box
                key={chat.id}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  ...(chat.user_id !== user.userId && {
                    flexDirection: "row-reverse",
                  }),
                  mb: 2,
                }}
                title={chat.user.username}>
                <Stack
                  alignItems={
                    chat.user_id !== user.userId ? "flex-start" : "flex-end"
                  }
                  sx={{
                    maxWidth: "75%",
                  }}>
                  {chattings[index - 1]?.user_id !== chat.user_id && (
                    <Typography>{chat.user.username}</Typography>
                  )}
                  <Stack
                    direction='row'
                    alignItems='flex-end'
                    gap={1}
                    sx={{
                      ...(chat.user_id !== user.userId && {
                        flexDirection: "row-reverse",
                      }),
                    }}>
                    <Typography
                      fontSize={(theme) => theme.typography.pxToRem(10)}>
                      {timeFormat(chat.created_at, "YYYY-MM-dd HH:mm:ss")}
                    </Typography>
                    <Paper
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": {
                          filter: "brightness(1.2)",
                        },
                      }}>
                      <Typography
                        onClick={
                          !chat.is_deleted && chat.user_id === user.userId
                            ? () => handleRemoveChat(chat.id)
                            : () => {}
                        }>
                        {chat.is_deleted
                          ? "삭제된 메세지 입니다."
                          : chat.message}
                      </Typography>
                    </Paper>
                  </Stack>
                </Stack>
                {chattings[index - 1]?.user_id !== chat.user_id ? (
                  <Avatar
                    alt={chat.user.username}
                    src={
                      chat.user.profiles[0]
                        ? "http://localhost:8080/api/users/profile/resource/" +
                          chat.user.profiles[0].new_name
                        : ""
                    }
                    sx={{
                      [chat.user_id !== user.userId ? "mr" : "ml"]: 2,
                    }}
                  />
                ) : (
                  <Box sx={{ width: 40 + 16, height: 40 }} />
                )}
              </Box>
            )
          )}
        </Box>
      </Stack>
      {newMessage && ignoreChatScroll && (
        <Box
          sx={{
            position: "relative",
            height: "0px",
          }}>
          <Tooltip title='New Messages' placement='top'>
            <IconButton
              onClick={() => chattingWindowScrollForceDown()}
              sx={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                transform: "translateX(-50%)",
              }}>
              <KeyboardDoubleArrowDownIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Divider sx={{ borderColor: "text.third" }} />
      <Box
        component='form'
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 2,
          p: 3,
          bgcolor: "background.paper",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          sendChat();
          clearInputValue();
          return;
        }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder='입력 후 엔터를 누르세요.'
          variant='outlined'
          value={inputValue}
          onChange={handleInputValue}
        />
        <Button type='submit' variant='contained' color='success'>
          <SendIcon sx={{ transform: "rotate(-45deg)" }} />
        </Button>
      </Box>
    </Stack>
  );
}

export default ChattingPage;
