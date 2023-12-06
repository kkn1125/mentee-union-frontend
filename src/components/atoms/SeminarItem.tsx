import { timeFormat } from "@/util/tool";
import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PlaceIcon from "@mui/icons-material/Place";

const SeminarItem = ({
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
  category,
  user,
}: Seminar) => {
  return (
    // <Card sx={{ marginBottom: 2 }}>
    <Card
      sx={{
        display: "flex",
        marginBottom: 2,
        padding: "8px",
        alignItems: "center",
      }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant='h5' component='div'>
          {title}
        </Typography>
        <Stack direction='row' gap={2} sx={{ my: 1 }}>
          <Chip label={category.name} size='small' />
        </Stack>
        <Typography gutterBottom variant='body1' sx={{ marginTop: 1.5 }}>
          {content}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ display: "flex", alignItems: "center" }}>
          <EmojiPeopleIcon fontSize='small' /> {user.username}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ display: "flex", alignItems: "center" }}>
          <PlaceIcon /> {meeting_place}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ display: "flex", alignItems: "center" }}>
          <AccessTimeIcon fontSize='small' sx={{ marginRight: "5px" }} />
          <span style={{ fontSize: "0.75rem" }}>
            모집 기간: {timeFormat(recruit_start_date, "YYYY-MM-dd")} -{" "}
            {timeFormat(recruit_end_date, "YYYY-MM-dd")}
          </span>
        </Typography>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ display: "flex", alignItems: "center" }}>
          <EventAvailableIcon fontSize='small' sx={{ marginRight: "5px" }} />
          <span style={{ fontSize: "0.75rem" }}>
            세미나 기간: {timeFormat(seminar_start_date, "YYYY-MM-dd")} -{" "}
            {timeFormat(seminar_end_date, "YYYY-MM-dd")}
          </span>
        </Typography>

        {/* <Typography variant='body2' color='text.secondary'>
          Participants: {limit_participant_amount}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Recruitment: {timeFormat(recruit_start_date, "YYYY-MM-dd")} -{" "}
          {timeFormat(recruit_end_date, "YYYY-MM-dd")}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Seminar: {timeFormat(seminar_start_date, "YYYY-MM-dd")} -{" "}
          {timeFormat(seminar_end_date, "YYYY-MM-dd")}
        </Typography> */}
        {is_recruit_finished && (
          <Chip label='Recruitment Finished' color='primary' />
        )}
        {is_seminar_finished && (
          <Chip label='Seminar Finished' color='success' />
        )}
      </CardContent>
      {/* 커버 이미지 추가 */}
      <CardMedia
        component='img'
        sx={{ width: 200, height: 200, objectFit: "cover" }}
        image={"https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"}
        alt='Seminar cover'
      />
    </Card>
  );
};

export default SeminarItem;
