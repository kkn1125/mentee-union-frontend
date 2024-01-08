import Loading from "@/components/atoms/common/Loading";
import SeminarCard from "@/components/atoms/seminar/SeminarCard";
import SeminarCardList from "@/components/atoms/seminar/SeminarCardList";
import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Box, Button, List, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Seminars() {
  const navigate = useNavigate();
  const tokenDispatch = useContext(TokenDispatchContext);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/seminars")
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminars(data);
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
    navigate("/community/seminars/edit");
  }

  return loading ? (
    <Loading />
  ) : (
    <Stack flex={1} gap={1}>
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
      <Stack gap={2} sx={{ mt: 2, minHeight: "90%" }}>
        <SeminarCardList
          emptyText='등록된 세미나가 없습니다.'
          seminars={seminars}
        />
      </Stack>
    </Stack>
  );
}

export default Seminars;
