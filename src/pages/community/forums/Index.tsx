import Loading from "@/components/atoms/common/Loading";
import ForumCardList from "@/components/atoms/forum/ForumCardList";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Button, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/forums")
      .then(({ data }) => data.data)
      .then((data) => {
        setForums(data);
        setLoading(false);
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
        }
      });
  }, []);

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleWriteArticle() {
    if (!token.token) {
      alert(FAIL_MESSAGE.REQUIRE_SIGN_IN);
      return;
    }
    navigate("/community/forums/edit");
  }

  return loading ? (
    <Loading />
  ) : (
    <Stack flex={1} gap={1} alignSelf='stretch'>
      <Stack direction='row' justifyContent='space-between' gap={1}>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/community")}>
          커뮤니티 돌아가기
        </Button>
        <Button variant='contained' color='info' onClick={handleWriteArticle}>
          글 작성
        </Button>
      </Stack>
      <Stack gap={2} sx={{ mt: 3, minHeight: "90%" }}>
        <ForumCardList
          emptyText='등록된 포럼 기사가 없습니다.'
          forums={forums}
        />
      </Stack>
    </Stack>
  );
}

export default Index;
