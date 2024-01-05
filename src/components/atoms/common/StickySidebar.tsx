import { Box } from "@mui/material";

const StickySidebar = (props: any) => {
  return (
    <Box
      {...props}
      sx={(theme) => ({
        position: "sticky",
        top: theme.spacing(10), // 예를 들어, 상단에서 10vh
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
      })}
    />
  );
};

export default StickySidebar;
