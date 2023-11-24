import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "@components/moleculars/Header";
import Footer from "@components/moleculars/Footer";

function Layout() {
  return (
    <Box>
      <Header />
      <Outlet />
      <Footer />
    </Box>
  );
}

export default Layout;
