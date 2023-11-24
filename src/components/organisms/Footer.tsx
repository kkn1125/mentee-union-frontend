import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        p: 3,
        background: (theme) => theme.palette.background.default,
        color: (theme) => theme.palette.text.primary,
      }}>
      <Typography align='center'>
        Copyright 2023. mentee union. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
