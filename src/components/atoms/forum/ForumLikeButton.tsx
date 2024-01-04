import Logger from "@/libs/logger";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import { IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type ForumLikeButtonProps = {
  forum_id: number;
  token?: string;
  likeCount: number;
};

const logger = new Logger(ForumLikeButton.name);

function ForumLikeButton({ forum_id, token, likeCount }: ForumLikeButtonProps) {
  const [count, setCount] = useState(likeCount || 0);
  useEffect(() => {
    count;
  }, []);
  function handleCount() {
    if (!token) {
      alert(FAIL_MESSAGE.REQUIRE_SIGN_IN);
      return;
    }
    axiosInstance
      .post(
        "/forums/like",
        {
          forum_id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then(({ data }) => data.data)
      .then((data) => {
        logger.log(data);
        logger.log(data.details);
        setCount(data.details);
      });
  }
  return (
    <Stack direction='row' gap={0} alignItems='center'>
      <IconButton onClick={handleCount}>
        <SignLanguageIcon />
      </IconButton>
      <Typography>{count}</Typography>
    </Stack>
  );
}

export default ForumLikeButton;
