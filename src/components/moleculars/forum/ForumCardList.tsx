import Loading from "@/components/atoms/Loading";
import ForumCard from "@/components/atoms/forum/ForumCard";
import { Stack, Box, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

type ForumCardListProps = {
  forums: Forum[];
};

function ForumCardList({ forums }: ForumCardListProps) {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isXsUp = useMediaQuery(theme.breakpoints.up("xs"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));

  const forumCardAmount = isXlUp ? 4 : isLgUp ? 3 : isMdUp ? 2 : isXsUp ? 1 : 1;

  useEffect(() => {
    if (forums) {
      setLoading(false);
    }
  }, [forums]);

  const forumsList = useMemo(() => {
    return forums.reduce(
      (acc: Forum[][], cur, index) => {
        if (acc[acc.length - 1].length === forumCardAmount) {
          acc.push([]);
        }
        acc[acc.length - 1].push(cur);
        if (
          index === forums.length - 1 &&
          acc[acc.length - 1].length !== forumCardAmount
        ) {
          acc[acc.length - 1] = acc[acc.length - 1].concat(
            ...new Array(forumCardAmount - acc[acc.length - 1].length).fill(
              null
            )
          );
        }
        return acc;
      },
      [[]]
    );
  }, [loading, forumCardAmount]);
  if (loading) {
    return <Loading />;
  }
  return forums.length === 0
    ? "등록된 포럼이 없습니다."
    : forumsList.map((forums, i) => (
        <Stack
          direction='row'
          flexWrap={"wrap"}
          gap={2}
          key={i + "|" + forums.length}>
          {forums.map((forum, idx) =>
            forum ? (
              <ForumCard key={forum.id} forum={forum} />
            ) : (
              <Box
                key={"empty|" + idx}
                sx={{
                  flex: 1,
                }}
              />
            )
          )}
        </Stack>
      ));
}

export default ForumCardList;
