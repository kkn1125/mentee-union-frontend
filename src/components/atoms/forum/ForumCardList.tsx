import Loading from "@/components/atoms/common/Loading";
import ForumCard from "@/components/atoms/forum/ForumCard";
import Logger from "@/libs/logger";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type ForumCardListProps = {
  forums: Forum[];
  emptyText: string;
};

const sm = 600;
const md = 900;
const lg = 1200;
const xl = 1536;

const logger = new Logger(ForumCardList.name);

function ForumCardList({ forums, emptyText }: ForumCardListProps) {
  const [loading, setLoading] = useState(true);
  const [breakpoints, setBreakpoints] = useState(1);
  // const xs = 0;

  function handleResize() {
    const isXlUp = innerWidth >= xl;
    const isLgUp = xl > innerWidth && innerWidth >= lg;
    const isMdUp = lg > innerWidth && innerWidth >= md;
    const isSmUp = lg > innerWidth && innerWidth >= sm;
    // const isXsUp = sm > innerWidth && innerWidth >= xs;
    const forumCardAmount = isXlUp
      ? 4
      : isLgUp
      ? 3
      : isMdUp
      ? 2
      : isSmUp
      ? 1
      : 1;
    setBreakpoints(forumCardAmount);
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      logger.info("확인");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (forums) {
      setLoading(false);
    }
  }, [forums]);

  const forumsList = useMemo(() => {
    return forums.reduce(
      (acc: Forum[][], cur, index) => {
        if (acc[acc.length - 1].length === breakpoints) {
          acc.push([]);
        }
        acc[acc.length - 1].push(cur);
        if (
          index === forums.length - 1 &&
          acc[acc.length - 1].length !== breakpoints
        ) {
          acc[acc.length - 1] = acc[acc.length - 1].concat(
            ...new Array(breakpoints - acc[acc.length - 1].length).fill(null)
          );
        }
        return acc;
      },
      [[]]
    );
  }, [loading, forums, breakpoints]);

  if (loading) {
    return <Loading />;
  }

  return forums.length === 0 ? (
    <Typography variant='body2'>{emptyText}</Typography>
  ) : (
    forumsList.map((forums, i) => (
      <Stack
        direction='row'
        flexWrap={"wrap"}
        gap={2}
        key={i + "|" + forums.length}>
        {forums.map((forum, idx) =>
          forum ? (
            <ForumCard
              key={forum.id}
              forum={forum}
              forumCardAmount={breakpoints}
            />
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
    ))
  );
}

export default ForumCardList;
