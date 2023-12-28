import { Tooltip, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

type MeetingPlaceProps = {
  place: string;
};

function MeetingPlace({ place }: MeetingPlaceProps) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title={"미팅 장소"} placement='left'>
        <PlaceIcon />
      </Tooltip>
      {place}
    </Typography>
  );
}

export default MeetingPlace;
