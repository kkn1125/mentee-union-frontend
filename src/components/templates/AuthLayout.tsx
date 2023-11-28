import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Container
      maxWidth='sm'
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}>
      <Outlet />
    </Container>
  );
}

export default AuthLayout;
