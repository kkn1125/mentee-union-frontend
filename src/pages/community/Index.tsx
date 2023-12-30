import Loading from "@/components/atoms/common/Loading";
import SeminarCard from "@/components/atoms/seminar/SeminarCard";
import ForumCardList from "@/components/moleculars/forum/ForumCardList";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  List,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SHOW_LIMIT = 4;

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

  const handleRedirect = (path: string | number) => {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  };

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
            <Button
              variant='contained'
              onClick={() => handleRedirect(`/community/mentoring`)}>
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
            <SeminarCard key={seminar.id} seminar={seminar} />
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
        <Stack gap={2} sx={{ minHeight: "90%" }}>
          <ForumCardList forums={forums.slice(0, SHOW_LIMIT)} />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Community;
