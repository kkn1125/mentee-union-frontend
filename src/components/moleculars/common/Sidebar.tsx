import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { KeyboardEvent, MouseEvent, ReactElement, useState } from "react";
import { Typography } from "@mui/material";
import { Socket } from "socket.io-client";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ChatIcon from "@mui/icons-material/Chat";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";

type Anchor = "top" | "bottom" | "left" | "right";
interface SidebarProps {
  socket: Socket;
  user: JwtDto;
  menuList: MentoringSession[];
  button?: ReactElement;
  buttonText?: string | ReactElement;
}

export default function Sidebar({
  socket,
  user,
  menuList = [],
  button,
  buttonText = "open",
}: SidebarProps) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  async function enterNew(session_id: number) {
    if (confirm("새로운 모임에 참여하시겠습니까?")) {
      try {
        await socket.emitWithAck("joinRoom", {
          session_id,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  function enterRoom(session_id: number) {
    socket.emit("enterRoom", {
      session_id,
    });
  }

  return (
    <Box>
      {button ? (
        <Box onClick={toggleDrawer("left", true)}>{button}</Box>
      ) : (
        <Button onClick={toggleDrawer("left", true)}>{buttonText}</Button>
      )}
      <SwipeableDrawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
        onOpen={toggleDrawer("left", true)}>
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={toggleDrawer("left", false)}
          onKeyDown={toggleDrawer("left", false)}>
          <Box sx={{ p: 2 }}>
            <Typography
              fontSize={(theme) => theme.typography.pxToRem(18)}
              fontWeight={700}>
              Mentoring List
            </Typography>
          </Box>
          <Divider sx={{ borderColor: "#565656" }} />
          <List>
            {menuList.length === 0 && (
              <ListItem disablePadding>
                <ListItemButton>
                  <Typography>등록된 멘토링이 없습니다.</Typography>
                </ListItemButton>
              </ListItem>
            )}
            {menuList.map(({ id, topic, mentorings, messages }, index) => (
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
                      messages.every((msg) =>
                        msg.readedUsers.every(
                          (usr) => usr.user_id !== user.userId
                        )
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
          <Divider sx={{ borderColor: "#565656" }} />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
