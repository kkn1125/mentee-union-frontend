import React from "react";
import GroupIcon from "@mui/icons-material/Group";
import { Tooltip, Typography } from "@mui/material";

type ParticipantsProps = {
  participants: number;
  limitParticipants: number;
};

function Participants({ participants, limitParticipants }: ParticipantsProps) {
  return (
    <Typography
      variant='body2'
      sx={{ display: "flex", alignItems: "center", gap: 0 }}>
      <Tooltip title={"모집 현황"} placement='left'>
        <GroupIcon />
      </Tooltip>
      {participants} / {limitParticipants}
    </Typography>
  );
}

export default Participants;
