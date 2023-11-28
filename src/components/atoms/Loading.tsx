import { CircularProgress, Stack } from "@mui/material";

function Loading() {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        // backgroundColor: "#56565656",
        width: "100%",
        height: "100%",
      }}>
      <CircularProgress />
    </Stack>
  );
}

export default Loading;
