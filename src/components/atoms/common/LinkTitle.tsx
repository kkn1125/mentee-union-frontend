import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

type LinkTitleProps = {
  to: string;
  title: string;
};

function LinkTitle({ to, title }: LinkTitleProps) {
  return (
    <Typography
      variant='h4'
      textTransform={"capitalize"}
      sx={{
        textDecoration: "none",
        color: "inherit",
      }}>
      <Typography
        component={Link}
        to={to}
        sx={{
          textDecoration: "inherit",
          textTransform: "inherit",
          color: "inherit",
          fontSize: "inherit",
          fontWeight: "inherit",
        }}>
        {title}
      </Typography>
    </Typography>
  );
}

export default LinkTitle;
