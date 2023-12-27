import Loading from "@/components/atoms/Loading";
import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { timeFormat } from "@/util/tool";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ForumLikeButton from "@/components/atoms/forum/ForumLikeButton";

function ForumDetail() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<JwtDto | null>(null);
  const [forum, setForum] = useState<Forum | null>(null);
  const params = useParams();
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);

  useEffect(() => {
    axiosInstance
      .get(`/forums/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setForum(data);
        axiosInstance
          .get("/auth/profile", {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data.data)
          .then((data) => setProfileData(data));
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

  if (forum === null) {
    return <Loading />;
  }

  const {
    id,
    user_id,
    title,
    content,
    view_count,
    deleted_at,
    created_at,
    updated_at,
    user,
    forumLikes,
  } = forum;

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleUpdateForum(forum_id: number) {
    navigate("/community/forums/edit/" + forum_id);
  }

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
          onClick={() => handleRedirect("/community/forums")}>
          포럼 둘러보기
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
            <Stack direction='row' gap={0} alignItems='center'>
              <IconButton>
                <VisibilityIcon />
              </IconButton>
              <Typography>{view_count || 0}</Typography>
            </Stack>
            <ForumLikeButton
              forum_id={id}
              likeCount={forumLikes.length}
              token={token.token}
            />
          </Stack>

          {forum.user_id === profileData?.userId && (
            <Button
              variant='contained'
              color='info'
              onClick={() => handleUpdateForum(forum.id)}>
              수정
            </Button>
          )}
        </Stack>
        <Stack gap={1}>
          <Stack direction='row' alignItems='center'>
            <AccountCircleIcon />
            <Typography>{user.username}</Typography>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />

        <Typography
          variant='body1'
          paragraph
          minHeight={"50vh"}
          dangerouslySetInnerHTML={{
            __html: content.replace(/<script|^<.*\s?onload=/gm, ""),
          }}></Typography>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <Box>
          <Tooltip title='작성 시간' placement='right'>
            <Typography variant='body2' component='span'>
              {`✍️ ${timeFormat(new Date(created_at), "YYYY-MM-dd HH:mm")}`}
            </Typography>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title='수정 시간' placement='right'>
            <Typography variant='body2' component='span'>
              {`📝 ${timeFormat(new Date(updated_at), "YYYY-MM-dd HH:mm")}`}
            </Typography>
          </Tooltip>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForumDetail;
