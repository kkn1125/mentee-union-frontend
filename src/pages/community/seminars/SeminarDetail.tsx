import Loading from "@/components/atoms/Loading";
import { TokenContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { timeFormat } from "@/util/tool";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SeminarDetail() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const token = useContext(TokenContext);
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const params = useParams();

  useEffect(() => {
    axiosInstance
      .get("/auth/profile", {
        headers: { Authorization: "Bearer " + token.token },
      })
      .then(({ data }) => data.data)
      .then((profile) => {
        setProfile(profile);
      });
    axiosInstance
      .get(`/seminars/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminar(data);
      });
  }, []);

  if (seminar === null || profile === null) {
    return <Loading />;
  }

  const {
    id,
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
    seminarParticipants,
    user,
  } = seminar;

  function handleJoinSeminar() {
    axiosInstance
      .post(
        "/seminars/join",
        {
          seminar_id: id,
        },
        {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        }
      )
      .then(({ data }) => data.data)
      .then((data) => {
        console.log(data);
        if (data.message.match(/success/)) {
          alert("세미나 참여 신청이 정상처리 되었습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Network Error") {
          alert(
            FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN +
              "\n보안을 위해 로그인 정보는 삭제됩니다."
          );
          return;
        } else {
          alert("세미나 신청에 문제가 발생했습니다.");
        }
      })
      .finally(() => {
        axiosInstance
          .get(`/seminars/${params.id}`)
          .then(({ data }) => data.data)
          .then((data) => {
            setSeminar(data);
          });
      });
  }

  function handleCancelJoinSeminar() {
    axiosInstance
      .delete("/seminars/cancel", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
        data: {
          seminar_id: id,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        console.log(data);
        if (data.message.match(/success/)) {
          alert("세미나 참여 취소가 정상처리 되었습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Network Error") {
          alert(
            FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN +
              "\n보안을 위해 로그인 정보는 삭제됩니다."
          );
          return;
        } else {
          alert("세미나 취소에 문제가 발생했습니다.");
        }
      })
      .finally(() => {
        axiosInstance
          .get(`/seminars/${params.id}`)
          .then(({ data }) => data.data)
          .then((data) => {
            setSeminar(data);
          });
      });
  }

  function handleRedirect(path: string) {
    navigate(path);
  }

  const alreadyJoined = seminarParticipants.some(
    (part) => part.user_id === profile.userId
  );

  return (
    <Container maxWidth='md'>
      <Button
        variant='contained'
        color='info'
        onClick={() => handleRedirect("/community/seminars")}>
        세미나 둘러보기
      </Button>
      <Paper elevation={3} sx={{ p: 3, marginTop: 2 }}>
        <Typography variant='h4' gutterBottom>
          {title}
        </Typography>
        <Stack gap={1}>
          <Stack direction='row' alignItems='center'>
            <AccountCircleIcon />
            <Typography>{user.username}</Typography>
          </Stack>
          <Box>
            <Chip
              label={category.name}
              size='small'
              color='primary'
              sx={{ marginBottom: 2 }}
            />
          </Box>
        </Stack>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <Typography variant='body1' paragraph minHeight={"50vh"}>
          {content}
        </Typography>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography variant='body2'>{`모집 기간: ${timeFormat(
            new Date(recruit_start_date),
            "YYYY-MM-dd HH:mm"
          )} - ${timeFormat(
            new Date(recruit_end_date),
            "YYYY-MM-dd HH:mm"
          )}`}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography variant='body2'>{`세미나 기간: ${timeFormat(
            new Date(seminar_start_date),
            "YYYY-MM-dd HH:mm"
          )} - ${timeFormat(
            new Date(seminar_end_date),
            "YYYY-MM-dd HH:mm"
          )}`}</Typography>
        </Box>
        <Typography variant='body2' paragraph>
          {`Meeting Place: ${meeting_place}`}
        </Typography>
        <Typography variant='body2' paragraph>
          {`최대 참여 인원: ${seminarParticipants.length}/${limit_participant_amount}`}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Tooltip
            title={alreadyJoined ? "이미 신청한 세미나입니다." : ""}
            placement='top'>
            <Box>
              <Button
                variant='contained'
                color='secondary'
                disabled={
                  seminarParticipants.length >= limit_participant_amount ||
                  alreadyJoined ||
                  is_recruit_finished ||
                  is_seminar_finished
                }
                onClick={handleJoinSeminar}>
                {is_recruit_finished ? "Recruitment Finished" : "Join Seminar"}
              </Button>
            </Box>
          </Tooltip>
          {alreadyJoined && (
            <Button
              color='error'
              variant='contained'
              onClick={handleCancelJoinSeminar}>
              참여 취소
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default SeminarDetail;
