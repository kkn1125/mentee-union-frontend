import Loading from "@/components/atoms/Loading";
import { TokenContext } from "@/context/TokenProvider";
import useWebSocket from "@/hooks/useWebSocket";
import { axiosInstance } from "@/util/instances";
import {
  Alert,
  AlertTitle,
  Badge,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
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
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Mentoring() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const [userData, setUserData] = useState<User | null>(null);
  const [socketUser, setSocketUser] = useState<UserModel | null>(null);
  const [getWs, connected, socketData, setUser, disconnect] = useWebSocket();
  const [currentChannel, setCurrentChannel] = useState<number>(-1);
  const [channels, setChannels] = useState<MentoringSession[]>([]);
  const [chattings, setChattings] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessionInfo, setSessionInfo] = useState({
    type: "",
    limit: 2,
  });
  const [group, setGroup] = useState<UserModel[]>([]);
  const chattingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      console.log("page out");
      console.log(getWs());
      console.log(disconnect);
      disconnect();
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
          getCategories();
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
    if (json.event === "messages/save") {
      // if (currentChannel !== -1) {
      //   setChattings(() => {
      //     chattingWindowScrolldown();
      //     return json.data.messages;
      //   });
      // }
      // chattingWindowScrolldown();
    } else if (json.event === "messages/removechat") {
      //
    } else if (json.event === "messages/new") {
      setChannels((channels) => {
        const temp = [...channels];
        let index = -1;
        for (let i = 0; i < temp.length; i++) {
          const channel = temp[i];
          if (channel.id === json.data.session.id) {
            index = temp.indexOf(channel);
            break;
          }
        }
        if (index > -1) {
          temp.splice(index, 1, json.data.session);
        }
        return temp;
      });
      chattingWindowScrolldown();
    } else if (json.event === "users/state") {
      setSocketUser(json.data.user);
    } else if (json.event === "users/matched") {
      setSocketUser(json.data.user);
      setChannels((channels) => {
        const temp = [...channels];
        for (const newChannel of json.data.session as MentoringSession[]) {
          if (channels.every((ch) => ch.id !== newChannel.id)) {
            temp.push(newChannel);
          }
        }
        return temp;
      });
      setGroup(json.data.group);
      setCurrentChannel(json.data.session_id);
    } else if (json.event === "users/matching") {
      setSocketUser(json.data.user);
    } else if (json.event === "users/cancelmatching") {
      setSocketUser(json.data.user);
      setGroup([]);
    } else if (json.event === "sessions/findall") {
      setSocketUser(json.data.user);
      setChannels((channels) => {
        const temp = [...channels];
        for (const newChannel of json.data.session as MentoringSession[]) {
          if (channels.every((ch) => ch.id !== newChannel.id)) {
            temp.push(newChannel);
          }
        }
        return temp;
      });
    } else if (json.event === "sessions/update") {
      setSocketUser(json.data.user);
      if (json.data.session.id === currentChannel) {
        setGroup(json.data.group);
      }
      setChannels((channels) => {
        const temp = [...channels];
        let index = -1;
        for (let i = 0; i < temp.length; i++) {
          const channel = temp[i];
          if (channel.id === json.data.session.id) {
            index = temp.indexOf(channel);
            break;
          }
        }
        console.log("json.data.session", json.data.session);
        if (index > -1) {
          temp.splice(index, 1, json.data.session);
        }
        return temp;
      });
    } else if (json.event === "sessions/change") {
      setSocketUser(json.data.user);
      setCurrentChannel(json.data.session_id);
      setChattings(() => {
        chattingWindowScrolldown(true);
        return json.data.messages;
      });
      setChannels((channels) => {
        const temp = [...channels];
        let index = -1;
        for (let i = 0; i < temp.length; i++) {
          const channel = temp[i];
          if (channel.id === json.data.session.id) {
            index = temp.indexOf(channel);
            break;
          }
        }
        if (index > -1) {
          temp.splice(index, 1, json.data.session);
        }
        return temp;
      });
    } else if (json.event === "sessions/leave") {
      setSocketUser(json.data.user);
    } else if (json.event === "sessions/out") {
      setSocketUser(json.data.user);
      setChannels(json.data.session);
      if (json.data.group) {
        setGroup(group);
      } else {
        setGroup([]);
      }
    }
  }, [socketData]);

  function switchChannel(session_id: number) {
    getWs().send(
      JSON.stringify({
        type: "sessions",
        event: "sessions/change",
        data: {
          session_id,
        },
      })
    );
  }

  function getCategories() {
    axiosInstance
      .get("/categories?seminars=true&mentoringSessions=true")
      .then(({ data }) => {
        setCategories(data.data);
      });
  }

  function getUserProfile() {
    axiosInstance
      .get("/users/profile", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => {
        const user = data.data as User;
        setUserData(user);
        setUser(user);
      });
  }

  function requestUserState() {
    getWs().send(
      JSON.stringify({
        type: "users",
        event: "users/state",
      })
    );
  }

  function sendChat() {
    const message = inputValue;
    setInputValue("");
    if (userData) {
      getWs().send(
        JSON.stringify({
          type: "messages",
          event: "messages/save",
          data: {
            session_id: currentChannel,
            message: message,
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
    getWs().send(
      JSON.stringify({
        type: "messages",
        event: "messages/removechat",
        data: {
          message_id: chat_id,
          session_id: currentChannel,
        },
      })
    );
  }

  function handleInputValue(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    setInputValue(target.value);
  }

  function chattingWindowScrolldown(direct: boolean = false) {
    setTimeout(() => {
      const current = chattingRef.current;
      if (current) {
        current.scrollTo({
          behavior: direct ? "instant" : "smooth",
          left: 0,
          top: current.scrollHeight + 100,
        });
      }
    }, 50);
  }

  function addMatching() {
    getWs().send(
      JSON.stringify({
        type: "users",
        event: "users/matching",
        data: sessionInfo,
      })
    );
  }

  function cancelMatching() {
    getWs().send(
      JSON.stringify({
        type: "users",
        event: "users/cancelmatching",
        data: sessionInfo,
      })
    );
  }

  // function handleCreateMentoringSession() {}

  function toWaitlist() {
    getWs().send(
      JSON.stringify({
        type: "sessions",
        event: "sessions/leave",
      })
    );
    setSessionInfo({
      type: "",
      limit: 2,
    });
    setCurrentChannel(-1);
  }

  function outSession(session_id: number) {
    getWs().send(
      JSON.stringify({
        type: "sessions",
        event: "sessions/out",
        data: {
          session_id: session_id,
        },
      })
    );

    setCurrentChannel((currentChannel) =>
      // 현재 채널과 동일하면 유지, 아니면 대기열로
      currentChannel === session_id ? -1 : currentChannel
    );
  }

  function handleSelectChangeSessionInfo(
    e: SelectChangeEvent<HTMLInputElement>
  ) {
    const target = e.target;
    if (target) {
      setSessionInfo((sessionInfo) => ({
        ...sessionInfo,
        [target.name]: +target.value,
      }));
    }
  }
  function handleChangeSessionInfo(e: ChangeEvent<HTMLInputElement>) {
    const target = e.target;
    if (target) {
      setSessionInfo((sessionInfo) => ({
        ...sessionInfo,
        [target.name]: +target.value,
      }));
    }
  }

  return !connected || !socketUser ? (
    <Loading />
  ) : (
    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{
        height: "inherit",
      }}>
      {/* channel list zone */}
      <Box
        sx={{
          borderRight: 1,
          flex: 0.4,
          borderColor: "text.third",
          bgcolor: "background.default",
          overflowY: "auto",
          position: "relative",
        }}>
        <Box
          sx={{
            position: {
              xs: "absolute",
              md: "relative",
            },
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}>
          <Paper square sx={{ py: 2, px: 3, bgcolor: "background.paper" }}>
            <Typography variant='h6'>Mentoring Chats</Typography>
          </Paper>
          {/* <Divider sx={{ borderColor: "text.third" }} /> */}
          <List>
            {channels
              .filter((channel) =>
                channel.mentorings.some(
                  (mentoring) => mentoring.mentee_id === socketUser?.user_id
                )
              )
              .map((channel) => (
                <ListItem
                  key={channel.id}
                  onClick={() => switchChannel(channel.id)}>
                  <Badge
                    badgeContent={
                      channel.messages.filter((message) =>
                        message.readedUsers.every(
                          (user) => user.user_id !== socketUser?.user_id
                        )
                      ).length
                    }
                    color='primary'>
                    <ListItemAvatar>
                      <Avatar
                        alt={channel.mentorings[0].user.username}
                        src={
                          channel.mentorings[0].user.profiles[0]?.new_name !==
                          "none"
                            ? "http://localhost:8080/api/users/profile/" +
                              channel.mentorings[0].user.profiles[0]?.new_name
                            : ""
                        }
                      />
                    </ListItemAvatar>
                  </Badge>
                  <ListItemText primary={`Channel ${channel.id}`} />
                  <Button
                    size='small'
                    variant='contained'
                    color='error'
                    onClick={() => outSession(channel.id)}>
                    나가기
                  </Button>
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>
      {/* channel matching panel */}
      {socketUser.state === "waitlist" || socketUser.state === "matching" ? (
        <Stack
          direction='column'
          flex={1}
          sx={{
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
            <Stack direction='row' gap={5} justifyContent={"center"}>
              <Stack
                direction='row'
                alignItems={"center"}
                gap={1}
                sx={{ my: 2 }}>
                <Stack direction='row' gap={1}>
                  <Select
                    fullWidth
                    name='type'
                    label='Category'
                    value={sessionInfo.type as "" & string}
                    onChange={handleSelectChangeSessionInfo}
                    sx={{
                      flex: 1,
                    }}>
                    <MenuItem value=''>Select</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    fullWidth
                    type='number'
                    inputProps={{
                      min: 2,
                      max: 5,
                    }}
                    value={sessionInfo.limit}
                    onChange={handleChangeSessionInfo}
                    sx={{
                      flex: 1,
                    }}
                  />
                </Stack>
                <Button
                  variant='contained'
                  onClick={
                    socketUser.state === "matching"
                      ? cancelMatching
                      : addMatching
                  }>
                  {socketUser.state === "matching"
                    ? "매칭 취소"
                    : "멘토링 세션 매칭"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Stack flex={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              height: "100%",
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
                    ?.category.name || `Channel ${currentChannel}`
                ).length > 8
                  ? (
                      channels.find((channel) => channel.id === currentChannel)
                        ?.category.name || `Channel ${currentChannel}`
                    ).slice(0, 8) + "..."
                  : channels.find((channel) => channel.id === currentChannel)
                      ?.category.name || `Channel ${currentChannel}`}
              </Typography>
              <Stack direction='row' gap={1}>
                <Button
                  size='small'
                  variant='contained'
                  color='warning'
                  onClick={toWaitlist}>
                  대기열로 돌아가기
                </Button>
                <Button
                  size='small'
                  variant='contained'
                  color='warning'
                  onClick={() => outSession(currentChannel)}>
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
              {channels
                .find((channel) => channel.id === currentChannel)
                ?.messages.map((chat) =>
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
                  ) : chat.user_id === socketUser.user_id ? (
                    <Box
                      key={chat.id}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
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
                          {chat.is_deleted
                            ? "삭제된 메세지 입니다."
                            : chat.message}
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
                          {chat.is_deleted
                            ? "삭제된 메세지 입니다."
                            : chat.message}
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
                sendChat();
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
                type='submit'
                sx={{
                  display: "none",
                }}>
                Send
              </Button>
            </Box>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
