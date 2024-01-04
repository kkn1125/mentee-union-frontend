import { List, Typography } from "@mui/material";
import SeminarCard from "../seminar/SeminarCard";

interface SeminarJoinedListProps {
  participants: SeminarParticipant[];
  emptyText: string;
}

function SeminarJoinedList({
  participants,
  emptyText,
}: SeminarJoinedListProps) {
  return (
    <List>
      {participants.length === 0 && (
        <Typography variant='body2'>{emptyText}</Typography>
      )}
      {participants.map(({ seminar }) => (
        <SeminarCard key={seminar.id} seminar={seminar} />
      ))}
    </List>
  );
}

export default SeminarJoinedList;
