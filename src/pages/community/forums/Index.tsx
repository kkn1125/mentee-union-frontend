import Loading from "@/components/atoms/Loading";
import ForumCard from "@/components/atoms/forum/ForumCard";
import ForumCardList from "@/components/moleculars/forum/ForumCardList";
import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
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
      {/* <Typography
        variant='h4'
        textTransform={"capitalize"}
        sx={{
          textDecoration: "none",
          color: "inherit",
        }}>
        <Typography
          component={Link}
          to='/community/forums'
          sx={{
            textDecoration: "inherit",
            textTransform: "inherit",
            color: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
          }}>
          forums
        </Typography>
      </Typography> */}
      <Stack gap={2} sx={{ minHeight: "90%" }}>
        <ForumCardList forums={forums} />
      </Stack>
    </Stack>
  );
}

export default Index;
