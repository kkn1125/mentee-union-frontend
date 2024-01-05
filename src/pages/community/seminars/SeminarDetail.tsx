import Loading from "@/components/atoms/common/Loading";
import NoticeBadge from "@/components/atoms/common/NoticeBadge";
import SunEditorViewer from "@/components/atoms/common/SunEditorViewer";
import ViewCount from "@/components/atoms/common/ViewCount";
import Duration from "@/components/atoms/seminar/Duration";
import MeetingPlace from "@/components/atoms/seminar/MeetingPlace";
import Owner from "@/components/atoms/seminar/Owner";
import Participants from "@/components/atoms/seminar/Participants";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { API_PATH, FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { isAfter, isBefore, isDoing } from "@/util/tool";
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

const logger = new Logger(SeminarDetail.name);

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
    title,
    content,
    view_count,
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
        if (data.message.match(/success/)) {
          alert("세미나 참여 신청이 정상처리 되었습니다.");
        }
      })
      .catch((error) => {
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
        logger.log(data);
        if (data.message.match(/success/)) {
          alert("세미나 참여 취소가 정상처리 되었습니다.");
        }
      })
      .catch((error) => {
        logger.log(error);
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

  const isBeforeRecruit = !is_recruit_finished && isBefore(recruit_start_date);
  const isDoingRecruit =
    !is_recruit_finished && isDoing(recruit_start_date, recruit_end_date);
  const isDoneRecruit = is_recruit_finished || isAfter(recruit_end_date);

  const isBeforeSeminar = !is_seminar_finished && isBefore(seminar_start_date);
  const isDoingSeminar =
    !is_seminar_finished && isDoing(seminar_start_date, seminar_end_date);
  const isDoneSeminar = is_seminar_finished || isAfter(seminar_end_date);

  const recruitState: [string, number] = (() => {
    if (isBeforeRecruit) {
      return ["모집 전", 0];
    } else if (isDoingRecruit) {
      return ["모집 중", 1];
    } else if (isDoneRecruit) {
      return ["모집 완료", 2];
    } else {
      return ["모집 완료", 2];
    }
  })();

  const seminarState: [string, number] = (() => {
    if (isBeforeSeminar) {
      return ["세미나 진행 전", 0];
    } else if (isDoingSeminar) {
      return ["세미나 진행 중", 1];
    } else if (isDoneSeminar) {
      return ["세미나 진행 완료", 2];
    } else {
      return ["세미나 진행 완료", 2];
    }
  })();

  const isDisabledJoinButton =
    !isDoingRecruit ||
    !profileData ||
    seminarParticipants.length >= limit_participant_amount ||
    alreadyJoined ||
    is_recruit_finished ||
    is_seminar_finished;

  const joinTooltipTitle =
    seminarState[1] === 2
      ? "이미 종료된 세미나입니다."
      : !isDoingRecruit && isBeforeRecruit
      ? "모집 전 입니다."
      : !isDoingRecruit && isDoneRecruit
      ? "이미 모집이 완료된 세미나 입니다."
      : alreadyJoined
      ? "이미 신청한 세미나입니다."
      : profileData
      ? ""
      : "로그인이 필요합니다.";

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
            <ViewCount viewCount={view_count} />
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
            src={API_PATH + "/seminars/cover/" + cover.new_name}
          />
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
          <NoticeBadge title={recruitState[0]} level={recruitState[1]} />
          <NoticeBadge title={seminarState[0]} level={seminarState[1]} />
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Tooltip title={joinTooltipTitle} placement='top'>
            <Box>
              <Button
                variant='contained'
                color='secondary'
                disabled={isDisabledJoinButton}
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
