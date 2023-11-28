import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

function Layout() {
  return (
    <Stack sx={{ height: "inherit" }}>
      <Header />
      <Stack sx={{ flex: 1, px: 1, overflowY: "auto" }}>
        <Outlet />
      </Stack>
      <Footer />
    </Stack>
  );
}

export default Layout;
