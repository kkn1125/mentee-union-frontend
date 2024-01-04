import { TokenContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Box, Button, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";

type SendPointButtonProps = {
  receiverId: number;
  points: number;
  reason?: string;
};

function SendPointButton({ receiverId, points, reason }: SendPointButtonProps) {
  const token = useContext(TokenContext);
  const [alreadyRecommended, setAlreadyRecommended] = useState(false);

  useEffect(() => {
    if (token.token) {
      axiosInstance
        .post(
          "/users/points/already",
          {
            receiver_id: receiverId,
          },
          {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          }
        )
        .then(({ data }) => data.data)
        .then((data) => {
          setAlreadyRecommended(data);
        });
    }
  }, [token.token]);

  function sendPoint() {
    if (!confirm("추천하시겠습니까? 기본 점수 5점을 보내고 1점을 얻습니다."))
      return;

    axiosInstance
      .post(
        "/users/points",
        {
          receiver_id: receiverId,
          points,
          reason: reason || "성장에 도움을 주셔서 감사합니다.",
        },
        {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        }
      )
      .then(({ data }) => data)
      .then((data) => {
        if (data.code === 200) {
          alert("추천이 완료되었습니다!");
        }
      })
      .catch((error) => {
        if (error.response.data.code === 400) {
          alert("점수 부여 대상은 중복 될 수 없습니다.");
        }
      });
  }

  function noticeSignin() {
    alert(FAIL_MESSAGE.REQUIRE_SIGN_IN);
  }

  return (
    <Tooltip
      title={alreadyRecommended ? "이미 추천한 멘티입니다." : ""}
      placement='left'>
      <Box>
        <Button
          disabled={alreadyRecommended}
          variant='contained'
          color='info'
          onClick={
            !alreadyRecommended && token.token ? sendPoint : noticeSignin
          }>
          추천하기
        </Button>
      </Box>
    </Tooltip>
  );
}

export default SendPointButton;
