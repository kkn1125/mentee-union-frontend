import { timeFormat } from "@/util/tool";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Tooltip, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

type DurationProps = {
  title: string;
  start: Date;
  end: Date;
  format: string;
  icon?: "calendar" | "clock";
};

function Duration({
  title,
  start,
  end,
  format,
  icon = "calendar",
}: DurationProps) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title={title} placement='left'>
        {icon === "calendar" ? <EventAvailableIcon /> : <AccessTimeIcon />}
      </Tooltip>
      {timeFormat(start, format)} - {timeFormat(end, format)}
    </Typography>
  );
}

export default Duration;
