import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { BRAND_NAME } from "@/util/global.constants";
import AccountCircle from "@mui/icons-material/AccountCircle";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const tokenDispatch = useContext(TokenDispatchContext);
  const token = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    tokenDispatch({
      type: TOKEN_ACTION.LOAD,
    });
  }, []);

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

  const menuListInfo = [
    {
      name: "Profile",
      onClick: () => {
        handleClose();
        handleRedirect("/user/profile");
      },
      isShow: !!token.token,
    },
    { name: "My Account", onClick: handleClose, isShow: !!token.token },
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
    <AppBar position='static' color='transparent' sx={{ zIndex: 100 }}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography
          variant='h6'
          component={Link}
          fontWeight={700}
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          to='/'>
          {BRAND_NAME}
        </Typography>
        <Box>
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
