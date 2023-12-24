import Loading from "@/components/atoms/Loading";
import SeminarItem from "@/components/atoms/SeminarItem";
import { axiosInstance } from "@/util/instances";
import { Box, Button, List, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Community() {
  const navigate = useNavigate();
  const [forums, setForums] = useState<Forum[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

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

  return !loading ? (
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
          {seminars.map((seminar: Seminar) => (
            <SeminarItem
              key={seminar.id}
              seminar={seminar}
              onClick={() => handleRedirectSeminar(seminar.id)}
            />
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
        <Stack gap={3}>
          {forums.length === 0 && "등록된 포럼이 없습니다."}
          {forums.map((forum) => (
            <Paper
              key={forum.id}
              onClick={() => handleRedirectForum(forum.id)}
              sx={{ p: 3, cursor: "pointer" }}>
              <Typography variant='h6' component='h6'>
                {forum.title}
              </Typography>
              <Typography variant='body1'>{forum.content}</Typography>
              <Typography variant='body2'>{forum.user.username}</Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Stack>
  ) : (
    <Loading />
  );
}

export default Community;
