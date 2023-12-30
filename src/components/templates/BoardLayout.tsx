import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function BoardLayout() {
  return (
    <Stack
      gap={10}
      justifyContent={"center"}
      alignItems={"center"}
      flex={1}
      sx={{
        width: {
          xs: "90%",
          md: "80%",
          lg: "70%",
        },
        mx: "auto",
        my: 5,
      }}>
      <Box
        sx={{
          width: "100%",
        }}>
        <Outlet />
      </Box>
    </Stack>
  );
}

export default BoardLayout;
