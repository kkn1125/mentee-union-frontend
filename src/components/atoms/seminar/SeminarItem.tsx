import { timeFormat } from "@/util/tool";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import MeetingPlace from "./MeetingPlace";
import Duration from "./Duration";
import Owner from "./Owner";
import NoticeBadge from "../common/NoticeBadge";
import Participants from "./Participants";

type SeminarItemProps = {
  seminar: Seminar;
};

const SeminarItem = ({ seminar }: SeminarItemProps) => {
  const navigate = useNavigate();
  const {
    host_id,
    category_id,
    title,
    content,
    meeting_place,
    limit_participant_amount,
    recruit_start_date,
    recruit_end_date,
    seminar_start_date,
    seminar_end_date,
    is_recruit_finished,
    is_seminar_finished,
    seminarParticipants,
    cover,
    category,
    user,
  } = seminar;

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  return (
    // <Card sx={{ marginBottom: 2 }}>
    <Card
      onClick={() => handleRedirect("/community/seminars/" + seminar.id)}
      sx={{
        display: "flex",
        marginBottom: 2,
        // padding: "8px",
        alignItems: "center",
        width: "100%",
        cursor: "pointer",
      }}>
      <CardContent sx={{ flex: 1, p: 4 }}>
        <Typography variant='h5' component='div'>
          {title}
        </Typography>
        <Stack direction='row' gap={2} sx={{ my: 1 }}>
          <Chip label={category.name} size='small' />
        </Stack>
        <Typography variant='body1' sx={{ my: 2 }}>
          {content}
        </Typography>
        <Stack gap={1}>
          <Owner username={user.username} />
          <MeetingPlace place={meeting_place} />
          <Participants
            participants={seminarParticipants.length}
            limitParticipants={limit_participant_amount}
          />
          <Duration
            title='모집 기간'
            start={recruit_start_date}
            end={recruit_end_date}
            format={"YYYY-MM-dd HH:mm"}
          />
          <Duration
            title='세미나 기간'
            start={seminar_start_date}
            end={seminar_end_date}
            format={"YYYY-MM-dd HH:mm"}
          />
          <Stack direction='row' gap={1}>
            <NoticeBadge
              title={
                is_recruit_finished || new Date(recruit_end_date) < new Date()
                  ? "모집 완료"
                  : "모집 중"
              }
              level={
                is_recruit_finished || new Date(recruit_end_date) < new Date()
                  ? 2
                  : 0
              }
            />
            <NoticeBadge
              title={
                !is_recruit_finished && seminar_start_date > new Date()
                  ? "세미나 진행 전"
                  : (is_recruit_finished && !is_seminar_finished) ||
                    (new Date(seminar_start_date) <= new Date() &&
                      new Date(seminar_end_date) >= new Date())
                  ? "세미나 진행 중"
                  : "세미나 마감"
              }
              level={
                !is_recruit_finished &&
                new Date(seminar_start_date) > new Date()
                  ? 0
                  : (is_recruit_finished && !is_seminar_finished) ||
                    (new Date(seminar_start_date) <= new Date() &&
                      new Date(seminar_end_date) >= new Date())
                  ? 1
                  : 2
              }
            />
          </Stack>
        </Stack>
      </CardContent>
      {/* 커버 이미지 추가 */}
      <CardMedia
        component='img'
        sx={{
          display: {
            xs: "none",
            lg: "inline-block",
          },
          alignSelf: "stretch",
          maxWidth: 400,
          width: "fit-content",
          objectFit: "cover",
        }}
        image={
          cover?.new_name ||
          "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
        }
        alt='Seminar cover'
      />
    </Card>
  );
};

export default SeminarItem;
