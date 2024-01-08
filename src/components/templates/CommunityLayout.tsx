import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function CommunityLayout() {
  return (
    <Stack
      gap={10}
      justifyContent={"flex-start"}
      sx={{
        width: {
          xs: "90%",
          md: "80%",
          lg: "70%",
        },
        mx: "auto",
        py: 5,
      }}>
      <Outlet />
    </Stack>
  );
}

export default CommunityLayout;
