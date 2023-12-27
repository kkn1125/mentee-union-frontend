import { axiosInstance } from "@/util/instances";
import { IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import { FAIL_MESSAGE } from "@/util/global.constants";

type ForumLikeButtonProps = {
  forum_id: number;
  token?: string;
  likeCount: number;
};

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
        console.log(data);
        console.log(data.details);
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
