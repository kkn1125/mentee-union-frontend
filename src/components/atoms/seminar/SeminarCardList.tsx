import Loading from "@/components/atoms/common/Loading";
import SeminarCard from "@/components/atoms/seminar/SeminarCard";
import { List, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type SeminarCardListProps = {
  seminars: Seminar[];
  emptyText: string;
};

function SeminarCardList({ seminars, emptyText }: SeminarCardListProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (seminars) {
      setLoading(false);
    }
  }, [seminars]);

  if (loading) {
    return <Loading />;
  }

  return seminars.length === 0 ? (
    <Typography variant='body2'>{emptyText}</Typography>
  ) : (
    <List>
      {/* 세미나 항목 */}
      {seminars.map((seminar: Seminar) => (
        <SeminarCard key={seminar.id} seminar={seminar} />
      ))}
    </List>
  );
}

export default SeminarCardList;
