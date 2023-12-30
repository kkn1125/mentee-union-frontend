import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, Stack, Typography } from "@mui/material";

type ViewCountProps = {
  viewCount: number;
};

function ViewCount({ viewCount }: ViewCountProps) {
  return (
    <Stack direction='row' gap={0} alignItems='center'>
      <IconButton>
        <VisibilityIcon />
      </IconButton>
      <Typography>{viewCount || 0}</Typography>
    </Stack>
  );
}

export default ViewCount;
