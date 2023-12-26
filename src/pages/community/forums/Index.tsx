import Loading from "@/components/atoms/Loading";
import ForumCard from "@/components/atoms/forum/ForumCard";
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
  const theme = useTheme();
  const isXsUp = useMediaQuery(theme.breakpoints.up("xs"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isXlUp = useMediaQuery(theme.breakpoints.up("xl"));

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

  const forumCardAmount = isXlUp ? 4 : isLgUp ? 3 : isMdUp ? 2 : isXsUp ? 1 : 1;
  const forumsList = useMemo(() => {
    return forums.reduce(
      (acc: Forum[][], cur, index) => {
        if (acc[acc.length - 1].length === forumCardAmount) {
          acc.push([]);
        }
        acc[acc.length - 1].push(cur);
        if (
          index === forums.length - 1 &&
          acc[acc.length - 1].length !== forumCardAmount
        ) {
          acc[acc.length - 1] = acc[acc.length - 1].concat(
            ...new Array(forumCardAmount - acc[acc.length - 1].length).fill(
              null
            )
          );
        }
        return acc;
      },
      [[]]
    );
  }, [loading, forumCardAmount]);

  return loading ? (
    <Loading />
  ) : (
    <Stack flex={1} gap={1} alignSelf="stretch">
      <Stack direction='row' gap={1}>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/community")}>
          커뮤니티 돌아가기
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
        {forums.length === 0 && "등록된 포럼이 없습니다."}
        {forumsList.map((forums, i) => (
          <Stack
            direction='row'
            flexWrap={"wrap"}
            gap={2}
            key={i + "|" + forums.length}>
            {forums.map((forum, idx) =>
              forum ? (
                <ForumCard key={forum.id} forum={forum} />
              ) : (
                <Box
                  key={"empty|" + idx}
                  sx={{
                    flex: 1,
                  }}
                />
              )
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default Index;
