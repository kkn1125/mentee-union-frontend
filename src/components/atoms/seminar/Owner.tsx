import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
        <AccountCircleIcon />
      </Tooltip>
      {username}
    </Typography>
  );
}

export default Owner;
