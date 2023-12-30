import { ColorModeContext } from "@/context/ThemeProvider";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { BRAND_NAME } from "@/util/global.constants";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [anchorMainEl, setAnchorMainEl] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const tokenDispatch = useContext(TokenDispatchContext);
  const token = useContext(TokenContext);
  const navigate = useNavigate();
  const theme = useContext(ColorModeContext);

  function changeMode() {
    theme.toggleColorMode();
  }

  const handleMainMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorMainEl(event.currentTarget);
  };

  const handleMainClose = () => {
    setAnchorMainEl(null);
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignout = () => {
    tokenDispatch({
      type: TOKEN_ACTION.SIGNOUT,
    });
  };

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  const menuMainListInfo = [
    {
      name: "Mentoring",
      onClick: () => {
        handleMainClose();
        handleRedirect("/community/mentoring");
      },
      isShow: true,
    },
    {
      name: "Seminars",
      onClick: () => {
        handleMainClose();
        handleRedirect("/community/seminars");
      },
      isShow: true,
    },
    {
      name: "Forums",
      onClick: () => {
        handleMainClose();
        handleRedirect("/community/forums");
      },
      isShow: true,
    },
    {
      name: "Notice",
      onClick: () => {
        handleMainClose();
        handleRedirect("/boards/notice");
      },
      isShow: true,
    },
    {
      name: "Event",
      onClick: () => {
        handleMainClose();
        handleRedirect("/boards/event");
      },
      isShow: true,
    },
    {
      name: "QNA",
      onClick: () => {
        handleMainClose();
        handleRedirect("/boards/qna");
      },
      isShow: true,
    },
  ];

  const menuListInfo = [
    {
      name: "Profile",
      onClick: () => {
        handleClose();
        handleRedirect("/user/profile");
      },
      isShow: !!token.token,
    },
    {
      name: "My Mentee",
      onClick: () => {
        handleClose();
        handleRedirect("/user/my-mentee");
      },
      isShow: !!token.token,
    },
    {
      name: "Sign in",
      onClick: () => {
        handleClose();
        handleRedirect("/auth/signin");
      },
      isShow: !token.token,
    },
    {
      name: "Sign out",
      onClick: () => {
        handleClose();
        setTimeout(() => {
          handleRedirect("/");
          handleSignout();
        }, 100);
      },
      isShow: !!token.token,
    },
  ];

  return (
    <AppBar
      position='static'
      color='transparent'
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}
          onClick={handleMainMenu}>
          <MenuIcon />
        </IconButton>
        <Menu
          id='menu-main-appbar'
          anchorEl={anchorMainEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorMainEl)}
          onClose={handleMainClose}>
          {menuMainListInfo.map(
            (info) =>
              info.isShow && (
                <MenuItem key={info.name} onClick={info.onClick}>
                  {info.name}
                </MenuItem>
              )
          )}
        </Menu>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant='h6'
            component={Link}
            fontWeight={700}
            sx={{ textDecoration: "none", color: "inherit" }}
            to='/'>
            {BRAND_NAME}
          </Typography>
        </Box>
        <Box>
          <IconButton
            size='large'
            aria-label='dark mode'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={() => {
              changeMode();
            }}
            color='inherit'>
            {theme.currentMode() === "light" ? (
              <DarkModeIcon />
            ) : (
              <LightModeIcon />
            )}
          </IconButton>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
            color='inherit'>
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            {menuListInfo.map(
              (info) =>
                info.isShow && (
                  <MenuItem key={info.name} onClick={info.onClick}>
                    {info.name}
                  </MenuItem>
                )
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
