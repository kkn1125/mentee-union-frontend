import Loading from "@/components/atoms/common/Loading";
import ForumCardList from "@/components/atoms/forum/ForumCardList";
import PointSystemList from "@/components/atoms/user/PointSystemList";
import SeminarJoinedList from "@/components/atoms/user/SeminarJoinedList";
import LevelSystem from "@/components/moleculars/home/LevelSystem";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { CHECK_MESSAGE, FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Box, Chip, List, Paper, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logger from "@/libs/logger";
import Grade from "@/components/atoms/common/Grade";

const logger = new Logger(MyMentee.name);

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
    Promise.all(
      ["", "/seminars", "/forums", "/points", "/mentorings"].map((path) =>
        axiosInstance.get(`/users/profile${path}`, {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        })
      )
    )
      .then((data: any) =>
        data.reduce((acc: User, cur: any) => {
          Object.assign(acc, cur.data.data);
          return acc;
        }, {})
      )
      .then((data: User) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((error) => {
        logger.log(error);
        alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
      });
  }

  function handleConfirmJoinSeminar(seminar_id: number) {
    if (!confirm(CHECK_MESSAGE.CONFIRM_JOIN_SEMINAR)) return;
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
          logger.log("success");
          setLoading(true);
        }
      })
      .then(() => getProfileDatas());
  }

  function handleCancelJoinSeminar(seminar_id: number) {
    if (!confirm(CHECK_MESSAGE.CONFIRM_CANCEL_JOIN_SEMINAR)) return;
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
        logger.log(data);
        if (data.data.message?.match(/success/)) {
          logger.log("success");
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

  const removeDuplicatedForumLikes = useMemo(() => {
    return profileData
      ? profileData.forumLikes.reduce((acc: Forum[], cur) => {
          if (!acc.some((item) => item.id === cur.forum.id)) {
            acc.push(cur.forum);
          }
          return acc;
        }, [])
      : [];
  }, [profileData]);

  return !profileData || loading ? (
    <Loading />
  ) : (
    <Stack
      component={Paper}
      gap={5}
      sx={{
        my: 3,
        p: 3,
      }}>
      <Box>
        <Typography variant='h4' gutterBottom>
          멘티 활동
        </Typography>
        <Typography variant='body2'>
          멘티와 함께 공유하고 서로 성장하면서 활동 영역을 넓혀보세요!
        </Typography>

        {/* 등급 */}
        <Paper sx={{ p: 2, my: 3 }}>
          <Typography variant='h6' gutterBottom>
            레벨 시스템
          </Typography>
          <Grade
            dir='row'
            name={profileData.grade.name}
            description={profileData.grade.description}
          />
          <LevelSystem
            level={profileData.level}
            points={
              profileData.points -
              (profileData.level > 0 ? (profileData.level - 1) * 50 + 100 : 0)
            }
            maxPoints={profileData.level * 50 + 100}
          />
        </Paper>
      </Box>

      <Box>
        {/* 추천 시스템 */}
        <Typography variant='h5' gutterBottom>
          추천한 멘티
        </Typography>
        <PointSystemList
          emptyText='추천한 멘티가 없습니다.'
          senderList={profileData.receivers}
        />
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>
          추천 해준 멘티
        </Typography>
        <PointSystemList
          emptyText='나를 추천한 멘티가 없습니다.'
          senderList={profileData.givers}
        />
      </Box>

      {/* 추천한 포럼 기사 */}
      <Box>
        <Typography variant='h5' gutterBottom>
          내가 추천한 포럼 기사
        </Typography>
        <List>
          <Stack gap={2} sx={{ minHeight: "90%" }}>
            <ForumCardList
              emptyText='추천한 포럼이 없습니다.'
              forums={removeDuplicatedForumLikes}
            />
          </Stack>
        </List>
      </Box>

      <Box>
        {/* 참여 중인 세미나 리스트 */}
        <Typography variant='h5' gutterBottom>
          참여 중인 세미나
        </Typography>
        <SeminarJoinedList
          emptyText='참여 중인 세미나가 없습니다.'
          participants={profileData.seminarParticipants}
        />
      </Box>

      <Box>
        <Typography variant='h5' gutterBottom>
          나의 포럼
        </Typography>
        {/* 작성한 포럼 리스트 */}
        <List>
          <Stack gap={2} sx={{ minHeight: "90%" }}>
            <ForumCardList
              emptyText='등록된 포럼이 없습니다.'
              forums={profileData.forums}
            />
          </Stack>
        </List>
      </Box>
    </Stack>
  );
}

export default MyMentee;
