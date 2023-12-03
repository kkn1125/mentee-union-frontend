import { Stack } from "@mui/material";
import { ReactElement } from "react";

function VerticalSection({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return (
    <Stack
      component='section'
      gap={5}
      flex={1}
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

export default VerticalSection;
