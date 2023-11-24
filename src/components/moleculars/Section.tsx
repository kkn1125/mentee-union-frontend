import { Stack } from "@mui/material";
import React, { ReactElement } from "react";

function Section({
  children,
  dir = "row",
}: {
  children: ReactElement | ReactElement[];
  dir?: "row" | "column";
}) {
  return (
    <Stack
      component='section'
      direction={dir}
      justifyContent={"center"}
      alignItems={"center"}
      gap={5}
      sx={{ my: 2 }}>
      {children}
    </Stack>
  );
}

export default Section;
