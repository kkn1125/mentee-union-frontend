import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Tooltip, Typography } from "@mui/material";

type OwnerProps = {
  username: string;
};

function Owner({ username }: OwnerProps) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title={"작성자"} placement='left'>
        <EmojiPeopleIcon fontSize='small' />
      </Tooltip>
      {username}
    </Typography>
  );
}

export default Owner;
