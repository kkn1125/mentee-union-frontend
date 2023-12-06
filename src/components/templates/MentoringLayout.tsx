import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function MentoringLayout() {
  return (
    <Stack
      id='mentoring-layout'
      sx={{
        backgroundColor: "background.paper",
        flex: 1,
        height: "100%",
      }}>
      <Outlet />
    </Stack>
  );
}

export default MentoringLayout;
