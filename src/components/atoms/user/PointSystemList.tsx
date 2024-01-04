import { List, Typography } from "@mui/material";
import { useMemo } from "react";

type pointSystemListProps = {
  senderList: UserRecommend[];
  emptyText: string;
};

function PointSystemList({ senderList, emptyText }: pointSystemListProps) {
  const removeDuplicatedSender = useMemo(() => {
    return senderList && senderList.length > 0
      ? senderList.reduce((acc: User[], cur) => {
          if (!acc.some((item) => item.id === cur.giver.id)) {
            acc.push(cur.giver);
          }
          return acc;
        }, [])
      : [];
  }, [senderList]);

  return (
    <List>
      {removeDuplicatedSender.length === 0 && (
        <Typography variant='body2'>{emptyText}</Typography>
      )}
      {removeDuplicatedSender.map((sender) => (
        <Typography key={sender.id}>{sender.username}</Typography>
      ))}
    </List>
  );
}

export default PointSystemList;
