import { Box, Chip, ChipOwnProps } from "@mui/material";

type NoticeBadgeProps = {
  title: string;
  level?: number;
};

const COLOR: ChipOwnProps["color"][] = ["info", "success", "error"];

function NoticeBadge({ title, level = 0 }: NoticeBadgeProps) {
  return (
    <Box>
      <Chip size='small' label={title} color={COLOR[level]} />
    </Box>
  );
}

export default NoticeBadge;
