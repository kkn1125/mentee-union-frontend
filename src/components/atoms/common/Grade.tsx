import { Chip, Stack, SxProps, Typography } from "@mui/material";

enum GRADE_COLOR {
  mentee0 = "#56ad6c",
  mentee1 = "#89ad56",
  mentor0 = "#6841bf",
  mentor1 = "#dc7031",
  mentor2 = "#cf2398",
}

type GRADE_COLOR_TYPE =
  | "mentee0"
  | "mentee1"
  | "mentor0"
  | "mentor1"
  | "mentor2";

type GradeProps = {
  dir?: "column" | "row";
  name: string;
  description: string;
  size?: "small" | "medium";
  sx?: SxProps;
};

function Grade({
  dir = "column",
  name = "mentee0",
  description,
  size = "small",
  sx = {},
}: GradeProps) {
  const gradeColor = GRADE_COLOR[name as GRADE_COLOR_TYPE];

  return dir === "row" ? (
    <Stack direction='row' alignItems='center' gap={1} sx={{ ...sx }}>
      <Chip
        label={name}
        size={size}
        sx={{
          color: "#ffffff",
          backgroundColor: gradeColor + " !important",
        }}
      />
      <Typography variant='body2'>{description}</Typography>
    </Stack>
  ) : (
    <Stack
      direction='column'
      alignItems='flex-start'
      justifyContent='center'
      gap={1}
      sx={{ ...sx }}>
      <Chip
        label={name}
        size={size}
        sx={{
          color: "#ffffff",
          backgroundColor: gradeColor + " !important",
        }}
      />
      <Typography variant='body2'>{description}</Typography>
    </Stack>
  );
}

export default Grade;
