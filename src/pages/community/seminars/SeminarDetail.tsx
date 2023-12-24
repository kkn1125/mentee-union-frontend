import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function SeminarDetail() {
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const params = useParams();

  useEffect(() => {
    axiosInstance
      .get(`/seminars/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminar(data);
      });
  }, []);

  if (seminar === null) {
    return <Loading />;
  }

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
    category,
    user,
  } = seminar;

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ p: 3, marginTop: 2 }}>
        <Typography variant='h4' gutterBottom>
          {title}
        </Typography>
        <Chip label={category.name} color='primary' sx={{ marginBottom: 2 }} />

        <Divider sx={{ my: 2 }} />

        <Typography variant='body1' paragraph>
          {content}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography variant='body2'>{`Seminar Dates: ${new Date(
            seminar_start_date
          ).toLocaleDateString()} - ${new Date(
            seminar_end_date
          ).toLocaleDateString()}`}</Typography>
        </Box>

        <Typography variant='body2' paragraph>
          {`Meeting Place: ${meeting_place}`}
        </Typography>

        <Typography variant='body2' paragraph>
          {`Participant Limit: ${limit_participant_amount}`}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant='contained'
            color='secondary'
            disabled={is_recruit_finished || is_seminar_finished}>
            {is_recruit_finished ? "Recruitment Finished" : "Join Seminar"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SeminarDetail;
