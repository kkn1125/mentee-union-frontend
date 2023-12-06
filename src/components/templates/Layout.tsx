import Footer from "@/components/organisms/common/Footer";
import Header from "@/components/organisms/common/Header";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Stack sx={{ height: "inherit" }}>
      <Header />
      <Stack sx={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </Stack>
      <Footer />
    </Stack>
  );
}

export default Layout;
