import { Stack } from "@mui/material";
import { ReactNode } from "react";

function Section({
  children,
  type = "vertical",
}: {
  children: ReactNode | ReactNode[];
  type?: "horizon" | "vertical";
}) {
  return (
    <Stack
      component='section'
      {...(type === "vertical" && {
        direction: "row",
        justifyContent: "center",
        alignItems: "center",
      })}
      gap={5}
      sx={{
        my: 2,
        p: 5,
        borderRadius: 0.5,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}>
      {children}
    </Stack>
  );
}

export default Section;
