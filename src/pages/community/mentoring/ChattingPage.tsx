import {
  Alert,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

type ChattingPageProps = {
  socket: Socket;
  sidebar: ReactElement;
  user: JwtDto;
  session: MentoringSession;
};

function ChattingPage({ socket, sidebar, user, session }: ChattingPageProps) {
  const [chattings, setChattings] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const chattingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChattings(session.messages);
    chattingWindowScrolldown();
  }, [session]);

  function chattingWindowScrolldown() {
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

  function clearInputValue() {
    setInputValue("");
  }

  function sendChat() {
    socket.emit("message", {
      session_id: session.id,
      topic: session.topic,
      message: inputValue,
    });
  }

  function handleInputValue(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }

  return (
    <Stack flex={1} sx={{ height: "inherit" }}>
      <Stack
        direction='row'
        alignItems='center'
        gap={1}
        sx={{ p: 2, minHeight: 66 }}>
        {sidebar}
        <Typography>{session.topic}</Typography>

        <Badge color={"info"} badgeContent={session.mentorings.length}>
          <GroupIcon />
        </Badge>
      </Stack>
      <Divider sx={{ borderColor: "#565656" }} />
      <Stack
        ref={chattingRef}
        flex={1}
        gap={2}
        sx={{
          p: 2,
          overflow: "auto",
        }}>
        <Box>
          {chattings.map((chat) =>
            chat.user_id === null ? (
              <Alert
                key={chat.id}
                color='success'
                sx={{
                  mb: 2,
                }}>
                <AlertTitle>{chat.username}</AlertTitle>
                {chat.message}
              </Alert>
            ) : chat.user_id === user.userId ? (
              <Box
                key={chat.id}
                sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                title={"" + chat.user_id}
                // onClick={() => handleRemoveChat(chat.id)}
              >
                <Paper
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    p: 2,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}>
                  <Typography>{chat.username}</Typography>
                  <Typography>
                    {chat.removed ? "삭제된 메세지 입니다." : chat.message}
                  </Typography>
                </Paper>
                <Avatar
                  alt='My User'
                  src={
                    chat.profile !== "none"
                      ? "http://localhost:8080/api/users/profile/" +
                        chat.profile
                      : ""
                  }
                  sx={{ ml: 2 }}
                />
              </Box>
            ) : (
              <Box
                key={chat.id}
                sx={{ display: "flex", mb: 2 }}
                title={"" + chat.user_id}>
                <Avatar
                  alt='User'
                  src={
                    chat.profile !== "none"
                      ? "http://localhost:8080/api/users/profile/" +
                        chat.profile
                      : ""
                  }
                  sx={{ mr: 2 }}
                />
                <Paper
                  sx={{
                    bgcolor: "grey.300",
                    p: 2,
                    borderRadius: 2,
                    maxWidth: "75%",
                  }}>
                  <Typography>{chat.username}</Typography>
                  <Typography>
                    {chat.removed ? "삭제된 메세지 입니다." : chat.message}
                  </Typography>
                </Paper>
              </Box>
            )
          )}
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "text.third" }} />
      <Box
        component='form'
        sx={{
          display: "flex",
          alignItems: "center",
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
          fullWidth
          placeholder='Type your message here...'
          variant='outlined'
          value={inputValue}
          onChange={handleInputValue}
        />
      </Box>
    </Stack>
  );
}

export default ChattingPage;
