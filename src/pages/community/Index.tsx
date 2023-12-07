import Loading from "@/components/atoms/Loading";
import SeminarItem from "@/components/atoms/SeminarItem";
import { axiosInstance } from "@/util/instances";
import { Box, Button, List, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      setForums(forumData.data);
      setSeminars(seminarData.data);
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
    <Box>
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

      {/* forum */}
      <Stack flex={1} gap={1}>
        <Typography variant='h4' textTransform={"capitalize"}>
          seminars
        </Typography>
        <List>
          {/* 세미나 항목 */}
          {/* 더 많은 세미나 항목들 */}
          {seminars.length === 0 && "등록된 세미나가 없습니다."}
          {seminars.map((seminar: Seminar) => (
            <SeminarItem
              key={seminar.id}
              host_id={seminar.host_id} // 예시 데이터를 적절한 필드로 대체해야 함
              category_id={seminar.category_id} // 예시 데이터를 적절한 필드로 대체해야 함
              title={seminar.title}
              content={seminar.content}
              meeting_place={seminar.meeting_place}
              limit_participant_amount={seminar.limit_participant_amount}
              recruit_start_date={seminar.recruit_start_date}
              recruit_end_date={seminar.recruit_end_date}
              seminar_start_date={seminar.seminar_start_date}
              seminar_end_date={seminar.seminar_end_date}
              is_recruit_finished={seminar.is_recruit_finished}
              is_seminar_finished={seminar.is_seminar_finished}
              user={seminar.user}
              category={seminar.category}
              id={seminar.id}
              deleted_at={seminar.deleted_at}
              created_at={seminar.created_at}
              updated_at={seminar.updated_at}
              seminarParticipants={seminar.seminarParticipants} // ... 기타 필요한 props ...
            />
          ))}
        </List>
      </Stack>

      {/* seminars */}
      <Stack flex={1} gap={1}>
        <Typography variant='h4' textTransform={"capitalize"}>
          forums
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
    </Box>
  ) : (
    <Loading />
  );
}

export default Community;
