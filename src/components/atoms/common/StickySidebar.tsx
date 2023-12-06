import { styled, Box } from "@mui/material";

const StickySidebar = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: theme.spacing(10), // 예를 들어, 상단에서 10vh
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

export default StickySidebar;
