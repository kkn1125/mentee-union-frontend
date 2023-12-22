import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Stack
      gap={10}
      justifyContent={"center"}
      alignItems={"center"}
      flex={1}
      sx={{ width: "100%", mx: "auto", my: 5 }}>
      <Box
        sx={{
          width: {
            xs: "90%",
            lg: "60%",
          },
        }}>
        <Outlet />
      </Box>
    </Stack>
  );
}

export default AuthLayout;
