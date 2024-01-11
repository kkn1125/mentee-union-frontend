import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  Fragment,
  MouseEvent as ReactMouseEvent,
  RefObject,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Logger from "@/libs/logger";

type PublicOrPrivateSessionListProps = {
  infoRef: RefObject<HTMLDivElement>;
  privacy?: boolean;
  user: JwtDto;
  sessionList: MentoringSession[];
  setMobileOpen?: Dispatch<SetStateAction<boolean>>;
  enterNew: (session_id: number, session: MentoringSession) => Promise<void>;
  enterRoom: (session_id: number) => void;
  sessionInfo: MentoringSession | null;
  setSessionInfo: Dispatch<SetStateAction<MentoringSession | null>>;
};

const logger = new Logger(PublicOrPrivateSessionList.name);

function PublicOrPrivateSessionList({
  infoRef,
  privacy = false,
  user,
  sessionList,
  setMobileOpen,
  enterNew,
  enterRoom,
  sessionInfo,
  setSessionInfo,
}: PublicOrPrivateSessionListProps) {
  const scope = privacy ? "비공개" : "공개";

  const readedIcon = () => (privacy ? <LockIcon /> : <ChatIcon />);

  const notReadedIcon = () =>
    privacy ? (
      <Badge color='default' variant='dot'>
        <LockIcon />
      </Badge>
    ) : (
      <MarkUnreadChatAltIcon />
    );

  function isNewfaceOrCrew(mentorings: Mentoring[], messages: Message[]) {
    const isCrew = mentorings.some((mtr) => mtr.mentee_id === user.userId);
    const isNotReadedSomeMessages =
      messages.length > 0 &&
      messages.some((msg) =>
        msg.readedUsers.every((usr) => usr.user_id !== user.userId)
      );
    if (!isCrew) {
      return <QuestionMarkIcon />;
    }

    if (isNotReadedSomeMessages) {
      return notReadedIcon();
    }
    return readedIcon();
  }

  function handleInfo(e: ReactMouseEvent, session: MentoringSession) {
    e.stopPropagation();
    setSessionInfo(session);
  }

  function closeInfo() {
    setSessionInfo(null);
  }

  if (sessionList.length === 0) {
    return (
      <ListItem disablePadding>
        <ListItemButton>
          <Typography>{scope} 세션이 없습니다.</Typography>
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <Fragment>
      {sessionList.map((session, i) => {
        const { id, topic, mentorings, messages } = session;
        return (
          <ListItem key={id} disablePadding>
            {sessionInfo && (
              <Paper
                id='session-info'
                ref={infoRef}
                sx={{
                  boxShadow: "0 0 0 9999px #56565656",
                  minWidth: 300,
                  position: "fixed",
                  top: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 5000,
                  wordBreak: "keep-all",
                }}>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  sx={{
                    px: 2,
                    py: 1,
                  }}>
                  <Stack direction='row' gap={1} alignItems='center'>
                    <Typography variant='subtitle1' fontWeight={700}>
                      {sessionInfo.topic}
                    </Typography>
                    {privacy && <LockIcon fontSize='small' />}
                  </Stack>
                  <Button
                    variant='contained'
                    color='error'
                    onClick={closeInfo}
                    size='small'
                    sx={{
                      px: 1.5,
                      minWidth: "auto",
                    }}>
                    &times;
                  </Button>
                </Stack>
                <Divider sx={{ borderColor: "#565656" }} />
                <Box sx={{ p: 2 }}>
                  <List>
                    <ListItemButton>
                      <Stack direction='row' gap={2}>
                        <Typography variant='body1'>목표</Typography>
                        <Typography variant='body2'>
                          {sessionInfo.objective}
                        </Typography>
                      </Stack>
                    </ListItemButton>
                    <ListItemButton>
                      <Stack direction='row' gap={2}>
                        <Typography variant='body1'>방식</Typography>
                        <Typography variant='body2'>
                          {sessionInfo.format}
                        </Typography>
                      </Stack>
                    </ListItemButton>
                    <ListItemButton>
                      <Stack direction='row' gap={2}>
                        <Typography variant='body1'>메모</Typography>
                        <Typography variant='body2'>
                          {sessionInfo.note}
                        </Typography>
                      </Stack>
                    </ListItemButton>
                    <ListItemButton>
                      <Stack direction='row' gap={2}>
                        <Typography variant='body1'>참여인원</Typography>
                        <Typography variant='body2'>
                          {sessionInfo.mentorings.length}
                        </Typography>
                      </Stack>
                    </ListItemButton>
                  </List>
                </Box>
              </Paper>
            )}
            <ListItemButton
              onClick={() => {
                setMobileOpen?.(false);
                mentorings.every((mtr) => mtr.mentee_id !== user.userId)
                  ? enterNew(id, sessionList[i])
                  : enterRoom(id);
              }}>
              <ListItemIcon>
                {isNewfaceOrCrew(mentorings, messages)}
              </ListItemIcon>
              <ListItemText primary={topic} />
              <Tooltip title='session info' placement='right'>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInfo(e, session);
                  }}
                  size='small'
                  sx={{
                    position: "absolute",
                    right: 5,
                    zIndex: 1,
                  }}>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          </ListItem>
        );
      })}
    </Fragment>
  );
}

export default memo(PublicOrPrivateSessionList);
