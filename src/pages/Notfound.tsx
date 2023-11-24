import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Notfound() {
  const navigate = useNavigate();

  function handleRedirectHome() {
    navigate("/");
  }

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        height: "100%",
      }}>
      <Typography variant='h1' gutterBottom>
        404
      </Typography>
      <Typography variant='h3' gutterBottom>
        not found
      </Typography>
      <Typography variant='body1' gutterBottom>
        페이지를 찾지 못 했습니다.
      </Typography>
      <Box>
        <Button variant='contained' onClick={handleRedirectHome}>
          홈으로
        </Button>
      </Box>
    </Stack>
  );
}

export default Notfound;
