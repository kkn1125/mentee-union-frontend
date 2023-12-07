import Loading from "@/components/atoms/Loading";
import { TokenContext } from "@/context/TokenProvider";
import useWebSocket from "@/hooks/useWebSocket";
import { axiosInstance } from "@/util/instances";
import { Alert, AlertTitle, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

export default function Mentoring() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const [userData, setUserData] = useState<User | null>(null);
  const [socketUser, setSocketUser] = useState<UserModel | null>(null);
  const [ws, connected, socketData, setUser, disconnect] = useWebSocket();
  const [currentChannel, setCurrentChannel] = useState<number>(-1);
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  const [chattings, setChattings] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const chattingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (ws) {
        disconnect(ws);
      }
    };
  }, []);

  useEffect(() => {
    if (!socketUser) {
      if (connected === true) {
        requestUserState();
        // setInterval(() => {
        //   sendMessage();
        // }, 3000);
      } else if (connected === false) {
        if (confirm("연결이 끊어졌습니다. 다시 연결하시겠습니까?")) {
          getUserProfile();
        } else {
          navigate("../");
        }
      }
    }
  }, [connected]);

  useEffect(() => {
    if (!socketUser) {
      if (token.status === "exists") {
        if (token.token) {
          console.log(123);
          getUserProfile();
        }
      }
    }
  }, [token.status]);

  useEffect(() => {
    /* sockete message 받는 곳 */
    console.log("origin", socketData);
    const json = JSON.parse(socketData.data || "{}");
    console.log(json);
    if (
      json.event === "getUserState" ||
      json.event === "addQueue" ||
      json.event === "dequeue" ||
      json.event === "toWaitList"
    ) {
      setSocketUser(() => json.data.user);
    } else if (json.event === "findAllChannels") {
      setChannels(() => json.data.channels);
    } else if (json.event === "outChannel") {
      if (json.data.user.user_id === socketUser?.user_id) {
        setSocketUser(() => json.data.user);
      }
    } else if (json.event === "outChannel/admin") {
      alert(
        "해당 채널에 혼자 남았습니다. 이제부터 어드민입니다. 채널이 매칭 대기열에 추가 됩니다."
      );
      if (json.data.user.user_id === socketUser?.user_id) {
        setSocketUser(() => json.data.user);
      }
    } else if (json.event === "chattings") {
      setChattings(() => json.data.chattings);
      chattingWindowScrolldown();
    } else if (json.event === "switchChannel") {
      setCurrentChannel(() => json.data.channel_id);
      setSocketUser(() => json.data.user);
      setChattings(() => json.data.chattings);
      chattingWindowScrolldown();
    } else if (json.event === "matched") {
      console.log("matched?");
      setCurrentChannel(() => json.data.channel_id);
      setSocketUser(() => json.data.user);
      setChattings(() => json.data.chattings);
      chattingWindowScrolldown();
    } else {
      console.log("안된놈", json);
    }
  }, [socketData]);

  function getUserProfile() {
    axiosInstance("/users/profile", {
      headers: {
        Authorization: "Bearer " + token.token,
      },
    }).then(({ data }) => {
      const user = data.data as User;
      setUserData(user);
      setUser(user);
    });
  }

  function requestUserState() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "getUserState",
      })
    );
  }

  function handleCreateMentoringSession() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "addChannel",
        data: {
          type: "it",
          content: "커스텀 내용",
        },
      })
    );
  }

  function joinChannel() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "joinChannel",
        data: {
          channel_id: 5,
        },
      })
    );
  }

  function matching() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "addQueue",
        data: {
          type: "it",
          content: "다음 내용",
        },
      })
    );
  }

  function sendChat() {
    const message = inputValue;
    setInputValue("");
    if (userData) {
      ws.send(
        JSON.stringify({
          type: "message",
          event: "chattings",
          data: {
            user_id: userData.id,
            username: userData.username,
            profile:
              userData?.profiles[0]?.new_name || socketUser?.profile || "none",
            message,
            removed: false,
            time: +new Date(),
          },
        })
      );
    }
  }

  function handleRemoveChat(chat_id: number) {
    if (confirm("해당 메세지를 지우시겠습니까? 삭제 후 복구 할 수 없습니다.")) {
      removeChat(chat_id);
    } else {
      // 취소
    }
  }

  function removeChat(chat_id: number) {
    ws.send(
      JSON.stringify({
        type: "message",
        event: "remove/chat",
        data: {
          chat_id,
        },
      })
    );
  }

  function matchingDone() {
    matchingDequeue();
  }

  function matchingCancel() {
    matchingDequeue();
  }

  function outChannel() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "outChannel",
        data: { channel_id: currentChannel },
      })
    );
    setCurrentChannel(-1);
    setChattings([]);
  }

  function matchingDequeue() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "dequeue",
        data: {
          type: "it",
        },
      })
    );
  }

  function switchChannel(channel_id: number) {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "switchChannel",
        data: {
          channel_id,
        },
      })
    );
  }

  function handleInputValue(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    setInputValue(target.value);
  }

  function toWaitList() {
    ws.send(
      JSON.stringify({
        type: "manager",
        event: "toWaitList",
      })
    );
    setChattings([]);
    setCurrentChannel(-1);
  }

  function chattingWindowScrolldown() {
    setTimeout(() => {
      const current = chattingRef.current;
      if (current) {
        current.scrollTo({
          behavior: "smooth",
          left: 0,
          top: current.scrollHeight,
        });
      }
    }, 500);
  }

  return (
    <Box
      sx={{
        display: "grid",
        // ...(connected &&
        //   socketUser &&
        //   socketUser.status.startsWith("room") && {
        //     gridTemplateColumns: "300px 1fr",
        //   }),
        gridTemplateColumns: "300px 1fr",
        height: "inherit",
      }}>
      {/* channel list zone */}
      <Box
        sx={{
          borderRight: 1,
          borderColor: "text.third",
          bgcolor: "background.default",
          overflowY: "auto",
        }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Paper square sx={{ py: 2, px: 3, bgcolor: "background.paper" }}>
            <Typography variant='h6'>Mentoring Chats</Typography>
          </Paper>
          {/* <Divider sx={{ borderColor: "text.third" }} /> */}
          <List>
            {channels
              .filter((channel) =>
                channel.users.some(
                  (user) => user.user_id === socketUser?.user_id
                )
              )
              .map((channel) => (
                <ListItem
                  key={channel.id + channel.name}
                  onClick={() =>
                    channel.id === currentChannel
                      ? () => {}
                      : switchChannel(channel.id)
                  }>
                  <ListItemAvatar>
                    <Avatar
                      alt='User 1'
                      src={
                        channel.admin.profile !== "none"
                          ? "http://localhost:8080/api/users/profile/" +
                            channel.admin.profile
                          : ""
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText primary={`Channel ${channel.id}`} />
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>
      {/* channel matching panel */}
      {!connected || !socketUser ? (
        <Loading />
      ) : socketUser.status === "waitlist" ||
        socketUser.status === "matching" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
          {/* chatting panel */}
          <Paper
            square
            sx={{
              display: "flex",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: "background.paper",
            }}>
            <Typography variant='h6'>멘토링 세션 생성하기</Typography>
          </Paper>
          {/* chatting panel - chat zone */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              ["&::-webkit-scrollbar"]: {
                width: 3,
                height: 3,
                backgroundColor: (theme) => theme.palette.background.default,
              },
              ["&::-webkit-scrollbar-thumb"]: {
                width: 3,
                height: 3,
                backgroundColor: (theme) => theme.palette.text.primary,
              },
            }}>
            {/* Chat bubbles */}

            <Stack gap={1} alignItems={"center"}>
              <Typography variant='body1'>
                원활한 멘토링을 위해 아래 사항을 준수 해주세요.
              </Typography>
              <Typography variant='body2'>
                1. 멘토링의 목적은 상호간 정보를 공유하고, 격려하며, 서로
                성장하는 것 입니다. 부적절한 목적은 제한 대상이 됩니다.
              </Typography>
              <Typography variant='body2'>
                2. 관심 분야를 정하고 "매칭하기"를 누르면 동일한 분야를 원하는
                멘티와 대화방이 생성됩니다.
              </Typography>
              <Typography variant='body2'>
                3. 직접 멘토링에 참여하려면 좌측 생성된 멘토링 세션을 클릭하고
                대화방 인원의 동의를 얻으면 참가 가능합니다.
              </Typography>
            </Stack>
            <Stack
              direction='row'
              gap={5}
              justifyContent={"center"}
              sx={{ height: "100%" }}>
              <Box sx={{ my: 2 }}>
                <Button
                  variant='contained'
                  onClick={handleCreateMentoringSession}>
                  멘토링 세션 생성
                </Button>
              </Box>
              <Box sx={{ my: 2 }}>
                <Button
                  variant='contained'
                  onClick={
                    socketUser.status === "matching" ? matchingCancel : matching
                  }>
                  {socketUser.status === "matching"
                    ? "매칭 취소"
                    : "멘토링 세션 매칭"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>
            {/* chatting panel */}
            <Paper
              square
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 5,
                px: 3,
                py: 2,
                bgcolor: "background.paper",
              }}>
              <Typography variant='h6'>
                {(
                  channels.find((channel) => channel.id === currentChannel)
                    ?.name || `Channel ${currentChannel}`
                ).length > 8
                  ? (
                      channels.find((channel) => channel.id === currentChannel)
                        ?.name || `Channel ${currentChannel}`
                    ).slice(0, 8) + "..."
                  : channels.find((channel) => channel.id === currentChannel)
                      ?.name || `Channel ${currentChannel}`}
              </Typography>
              <Stack direction='row' gap={1}>
                <Button
                  size='small'
                  variant='contained'
                  color='warning'
                  onClick={toWaitList}>
                  대기열로 돌아가기
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  color='warning'
                  onClick={outChannel}>
                  나가기
                </Button>
              </Stack>
            </Paper>
            {/* chatting panel - chat zone */}
            <Box
              ref={chattingRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                ["&::-webkit-scrollbar"]: {
                  width: 3,
                  height: 3,
                  backgroundColor: (theme) => theme.palette.background.default,
                },
                ["&::-webkit-scrollbar-thumb"]: {
                  width: 3,
                  height: 3,
                  backgroundColor: (theme) => theme.palette.text.primary,
                },
              }}>
              {chattings.map((chat) =>
                chat.username === "system" ? (
                  <Alert
                    key={chat.id}
                    color='success'
                    sx={{
                      mb: 2,
                    }}>
                    <AlertTitle>{chat.username}</AlertTitle>
                    {chat.message}
                  </Alert>
                ) : chat.user_id === socketUser.user_id ? (
                  <Box
                    key={chat.id}
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                    title={"" + chat.user_id}
                    onClick={() => handleRemoveChat(chat.id)}>
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
              {/* Chat bubbles */}
            </Box>
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
                return;
              }}>
              <TextField
                fullWidth
                placeholder='Type your message here...'
                variant='outlined'
                value={inputValue}
                onChange={handleInputValue}
              />
              <Button
                variant='contained'
                onClick={sendChat}
                type='submit'
                sx={{
                  display: "none",
                }}>
                Send
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
