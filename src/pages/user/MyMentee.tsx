import Loading from "@/components/atoms/Loading";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyMentee() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfileDatas();
  }, []);

  function getProfileDatas() {
    axiosInstance
      .get("/users/profile", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      });
  }

  function handleConfirmJoinSeminar(seminar_id: number) {
    if (
      !confirm(
        "세미나 참여 확정 후 취소하시면 다시 신청하셔야합니다. 세미나에 참여 확정 하시겠습니까?"
      )
    )
      return;
    axiosInstance
      .post(
        "/seminars/confirm",
        {
          seminar_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        }
      )
      .then(({ data }) => {
        if (data.message.match(/success/)) {
          console.log("success");
          setLoading(true);
        }
      })
      .then(() => getProfileDatas());
  }

  function handleCancelJoinSeminar(seminar_id: number) {
    if (!confirm("세미나 참여를 취소하시겠습니까?")) return;
    axiosInstance
      .delete("/seminars/cancel", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
        data: {
          seminar_id,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        console.log(data);
        if (data.data.message?.match(/success/)) {
          console.log("success");
          setLoading(true);
        }
      })
      .then(() => getProfileDatas())
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
        }
      });
  }

  return !profileData || loading ? (
    <Loading />
  ) : (
    <Stack>
      <Paper
        sx={{
          p: 3,
        }}>
        <Typography variant='h4' gutterBottom>
          멘티 활동
        </Typography>
        <Typography variant='body2'>멘티 활동을 관리해보세요!</Typography>

        {/* <Divider
          sx={{
            my: 2,
            borderColor: "#565656",
          }}
        /> */}

        {/* 등급 */}
        <Paper sx={{ p: 2, my: 3 }}>
          <Typography variant='body1' gutterBottom>
            현재 등급
          </Typography>
          <Stack direction='row' alignItems='center' gap={1}>
            <Chip label={profileData.grade.name} size='small' />
            <Box>{profileData.grade.description}</Box>
          </Stack>
        </Paper>

        {/* <Divider
          sx={{
            my: 2,
            borderColor: "#565656",
          }}
        /> */}

        {/* 참여 중인 세미나 리스트 */}
        <Typography variant='h5' gutterBottom>
          참여 중인 세미나
        </Typography>
        <List>
          {profileData.seminarParticipants.length === 0 && (
            <Typography>참여 중인 세미나가 없습니다.</Typography>
          )}
          {profileData.seminarParticipants.map(({ seminar, is_confirm }) => (
            <Paper key={seminar.id}>
              <Box
                sx={{
                  p: 2,
                }}>
                <Typography variant='h6'>{seminar.title}</Typography>
              </Box>
              <Divider sx={{ borderColor: "#565656" }} />
              <Box sx={{ p: 2 }}>
                <Typography variant='body2'>{seminar.content}</Typography>
              </Box>
              <Divider sx={{ borderColor: "#565656" }} />
              <Stack
                direction='row'
                gap={2}
                sx={{
                  p: 2,
                }}>
                <Button
                  disabled={is_confirm}
                  variant='contained'
                  color='info'
                  onClick={() => handleConfirmJoinSeminar(seminar.id)}>
                  참여 확정
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => handleCancelJoinSeminar(seminar.id)}>
                  참여 취소
                </Button>
              </Stack>
            </Paper>
          ))}
        </List>

        {/* 작성한 포럼 리스트 */}
      </Paper>
    </Stack>
  );
}

export default MyMentee;
