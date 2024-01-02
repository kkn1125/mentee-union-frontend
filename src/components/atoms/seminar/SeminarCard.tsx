import { API_PATH } from "@/util/global.constants";
import { isAfter, isBefore, isDoing } from "@/util/tool";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NoticeBadge from "../common/NoticeBadge";
import SunEditorViewer from "../common/SunEditorViewer";
import Duration from "./Duration";
import MeetingPlace from "./MeetingPlace";
import Owner from "./Owner";
import Participants from "./Participants";

type SeminarCardProps = {
  seminar: Seminar;
};

const SeminarCard = ({ seminar }: SeminarCardProps) => {
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

  const isBeforeRecruit = !is_recruit_finished && isBefore(recruit_start_date);
  const isDoingRecruit =
    !is_recruit_finished && isDoing(recruit_start_date, recruit_end_date);
  const isDoneRecruit = is_recruit_finished || isAfter(recruit_end_date);

  const isBeforeSeminar = !is_seminar_finished && isBefore(seminar_start_date);
  const isDoingSeminar =
    !is_seminar_finished && isDoing(seminar_start_date, seminar_end_date);
  const isDoneSeminar = is_seminar_finished || isAfter(seminar_end_date);

  const recruitState = useMemo<[string, number]>(() => {
    if (isBeforeRecruit) {
      return ["모집 전", 0];
    } else if (isDoingRecruit) {
      return ["모집 중", 1];
    } else if (isDoneRecruit) {
      return ["모집 완료", 2];
    } else {
      return ["모집 완료", 2];
    }
  }, []);

  const seminarState = useMemo<[string, number]>(() => {
    if (isBeforeSeminar) {
      return ["세미나 진행 전", 0];
    } else if (isDoingSeminar) {
      return ["세미나 진행 중", 1];
    } else if (isDoneSeminar) {
      return ["세미나 진행 완료", 2];
    } else {
      return ["세미나 진행 완료", 2];
    }
  }, []);

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
        <Stack
          direction='row'
          gap={1}
          justifyContent='space-between'
          alignItems='center'>
          <Typography variant='h5' component='div'>
            {title}
          </Typography>
        </Stack>
        <Stack direction='row' gap={2} sx={{ my: 1 }}>
          <Chip label={category.name} size='small' />
        </Stack>
        {/* <Typography variant='body1' sx={{ my: 2 }}>
          {content}
        </Typography> */}
        <SunEditorViewer
          content={content}
          wrapSx={{
            overflow: "hidden",
            maxHeight: 100,
          }}
        />
        <Stack gap={1}>
          <Owner username={user.username} />
          <MeetingPlace place={meeting_place} />
          <Participants
            participants={seminarParticipants?.length || 0}
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
            <NoticeBadge title={recruitState[0]} level={recruitState[1]} />
            <NoticeBadge title={seminarState[0]} level={seminarState[1]} />
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
          cover
            ? API_PATH + "/seminars/cover/" + cover.new_name
            : "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
        }
        alt='Seminar cover'
      />
    </Card>
  );
};

export default SeminarCard;
