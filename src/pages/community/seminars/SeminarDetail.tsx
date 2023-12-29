import Loading from "@/components/atoms/Loading";
import NoticeBadge from "@/components/atoms/common/NoticeBadge";
import SunEditorViewer from "@/components/atoms/common/SunEditorViewer";
import Duration from "@/components/atoms/seminar/Duration";
import MeetingPlace from "@/components/atoms/seminar/MeetingPlace";
import Owner from "@/components/atoms/seminar/Owner";
import Participants from "@/components/atoms/seminar/Participants";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { API_PATH, FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
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
  const [profileData, setProfileData] = useState<JwtDto | null>(null);
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const params = useParams();

  useEffect(() => {
    if (token.token) {
      axiosInstance
        .get("/auth/profile", {
          headers: { Authorization: "Bearer " + token.token },
        })
        .then(({ data }) => data.data)
        .then((profile) => {
          setProfileData(profile);
        });
    }
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
    cover,
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
          tokenDispatch({
            type: TOKEN_ACTION.SIGNOUT,
          });
          navigate("/");
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

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleUpdateSeminar(seminar_id: number) {
    navigate("/community/seminars/edit/" + seminar_id);
  }

  const alreadyJoined =
    profileData &&
    seminarParticipants.some((part) => part.user_id === profileData.userId);

  return (
    <Container maxWidth='md'>
      <Stack direction='row' gap={1}>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect(-1)}>
          이전으로 돌아가기
        </Button>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/community/seminars")}>
          세미나 둘러보기
        </Button>
      </Stack>
      <Paper elevation={3} sx={{ p: 3, marginTop: 2 }}>
        <Stack
          direction='row'
          justifyContent={"space-between"}
          alignItems='center'
          sx={{ mb: 1 }}>
          <Stack direction='row' gap={1} alignItems='center'>
            <Typography variant='h4'>{title}</Typography>
            {/* <Stack direction='row' gap={0} alignItems='center'>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
            <Typography>{view_count || 0}</Typography>
          </Stack> */}
          </Stack>
          {seminar.host_id === profileData?.userId && (
            <Button
              variant='contained'
              color='info'
              onClick={() => handleUpdateSeminar(seminar.id)}>
              수정
            </Button>
          )}
        </Stack>
        <Stack gap={1}>
          <Box>
            <Chip
              label={category.name}
              size='small'
              color='primary'
              sx={{ marginBottom: 2 }}
            />
          </Box>
        </Stack>
        <Stack gap={1}>
          <Owner username={user.username} />
          <MeetingPlace place={meeting_place} />
          <Participants
            participants={seminar.seminarParticipants.length}
            limitParticipants={limit_participant_amount}
          />
          <Duration
            title={"모집 기간"}
            start={recruit_start_date}
            end={recruit_end_date}
            format={"YYYY-MM-dd HH:mm"}
          />
          <Duration
            title={"세미나 기간"}
            start={seminar_start_date}
            end={seminar_end_date}
            format={"YYYY-MM-dd HH:mm"}
          />
        </Stack>
        {cover && (
          <Box
            component='img'
            width={300}
            src={API_PATH + "/seminars/cover/" + cover.new_name}></Box>
        )}
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <SunEditorViewer
          content={content}
          wrapSx={{
            overflow: "auto",
          }}
          sx={{
            minHeight: "50vh",
          }}
        />
        <Divider sx={{ my: 2, borderColor: "#565656" }} />

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
              !is_recruit_finished && new Date(seminar_start_date) > new Date()
                ? 0
                : (is_recruit_finished && !is_seminar_finished) ||
                  (new Date(seminar_start_date) <= new Date() &&
                    new Date(seminar_end_date) >= new Date())
                ? 1
                : 2
            }
          />
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Tooltip
            title={
              alreadyJoined
                ? "이미 신청한 세미나입니다."
                : profileData
                ? ""
                : "로그인이 필요합니다."
            }
            placement='top'>
            <Box>
              <Button
                variant='contained'
                color='secondary'
                disabled={
                  !profileData ||
                  seminarParticipants.length >= limit_participant_amount ||
                  alreadyJoined ||
                  is_recruit_finished ||
                  is_seminar_finished
                }
                onClick={profileData ? handleJoinSeminar : () => {}}>
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
