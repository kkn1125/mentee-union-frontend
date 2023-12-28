import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <Stack
      gap={10}
      sx={{
        width: {
          xs: "90%",
          md: "80%",
          lg: "70%",
        },
        margin: "auto",
      }}>
      <Outlet />
    </Stack>
  );
}

export default UserLayout;
