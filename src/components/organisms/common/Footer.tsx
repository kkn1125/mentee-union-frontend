import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        p: 3,
        borderTop: "1px solid #565656",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
      }}>
      <Typography align='center'>
        Copyright 2023. mentee union. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
