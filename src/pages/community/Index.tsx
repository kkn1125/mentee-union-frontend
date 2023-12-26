import Loading from "@/components/atoms/Loading";
import SeminarItem from "@/components/atoms/seminar/SeminarItem";
import ForumCard from "@/components/atoms/forum/ForumCard";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Grid,
  List,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SHOW_LIMIT = 5;

function Community() {
  const navigate = useNavigate();
  const [forums, setForums] = useState<Forum[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isXsUp = useMediaQuery(theme.breakpoints.up("xs"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));

  const forumCardAmount = isXlUp ? 4 : isLgUp ? 3 : isMdUp ? 2 : isXsUp ? 1 : 1;

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/forums"),
      axiosInstance.get("/seminars"),
    ]).then(([{ data: forumData }, { data: seminarData }]) => {
      setForums(forumData.data.slice(0, 5));
      setSeminars(seminarData.data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const handleRedirectSeminar = (path: number) => {
    navigate(`/community/seminars/${path}`);
  };

  const handleRedirectForum = (path: number) => {
    navigate(`/community/forums/${path}`);
  };

  const handleRedirectMentoring = () => {
    navigate(`/community/mentoring`);
  };

  const forumsList = useMemo(() => {
    return forums.slice(0, SHOW_LIMIT).reduce(
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

  return loading ? (
    <Loading />
  ) : (
    <Stack gap={3}>
      {/* mentoring */}
      <Stack flex={1} gap={1}>
        <Typography variant='h4' textTransform={"capitalize"}>
          mentoring
        </Typography>
        <Stack gap={3}>
          <Typography variant='body2'>
            관심사 매칭을 통해 멘토/멘티와 소통해보세요!
          </Typography>
          <Box>
            <Button variant='contained' onClick={handleRedirectMentoring}>
              매칭하기
            </Button>
          </Box>
        </Stack>
      </Stack>

      {/* seminars */}
      <Stack flex={1} gap={1}>
        <Typography
          variant='h4'
          textTransform={"capitalize"}
          sx={{
            textDecoration: "none",
            color: "inherit",
          }}>
          <Typography
            component={Link}
            to='/community/seminars'
            sx={{
              textDecoration: "inherit",
              textTransform: "inherit",
              color: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
            }}>
            seminars
          </Typography>
        </Typography>
        <List>
          {/* 세미나 항목 */}
          {/* 더 많은 세미나 항목들 */}
          {seminars.length === 0 && "등록된 세미나가 없습니다."}
          {seminars.slice(0, SHOW_LIMIT).map((seminar: Seminar) => (
            <SeminarItem key={seminar.id} seminar={seminar} />
          ))}
        </List>
      </Stack>

      {/* forums */}
      <Stack flex={1} gap={1}>
        <Typography
          variant='h4'
          textTransform={"capitalize"}
          sx={{
            textDecoration: "none",
            color: "inherit",
          }}>
          <Typography
            component={Link}
            to='/community/forums'
            sx={{
              textDecoration: "inherit",
              textTransform: "inherit",
              color: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
            }}>
            forums
          </Typography>
        </Typography>
        <Stack gap={2}>
          {forums.length === 0 && "등록된 포럼이 없습니다."}
          {forumsList.map((forums, i) => (
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
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Community;
