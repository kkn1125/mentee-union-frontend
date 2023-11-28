import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function CommunityLayout() {
  return (
    <Stack gap={10} sx={{ width: "60%", margin: "auto" }}>
      <Outlet />
    </Stack>
  );
}

export default CommunityLayout;
