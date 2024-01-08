import Loading from "@/components/atoms/common/Loading";
import SunEditorViewer from "@/components/atoms/common/SunEditorViewer";
import ViewCount from "@/components/atoms/common/ViewCount";
import Owner from "@/components/atoms/seminar/Owner";
import { TokenContext } from "@/context/TokenProvider";
import { boardType } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { timeFormat } from "@/util/tool";
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
import LockIcon from "@mui/icons-material/Lock";

function BoardDetail() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const params = useParams();
  const [profileData, setProfileData] = useState<JwtDto | null>(null);
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/boards/${params.type}/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setBoard(data);
      });

    axiosInstance
      .get("/auth/profile", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        setProfileData(data);
      });
  }, []);

  if (board === null) {
    return <Loading />;
  }

  const {
    id,
    user_id,
    type,
    title,
    content,
    view_count,
    visible,
    sequence,
    deleted_at,
    created_at,
    updated_at,
    user,
  } = board;

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
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
          onClick={() => handleRedirect("/boards/" + type)}>
          {boardType[type as BOARD_TYPE]} 둘러보기
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
            <ViewCount viewCount={view_count} />
            {!visible && (
              <Tooltip title='비공개 게시글' placement='top' color='success'>
                <IconButton>
                  <LockIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {user_id === profileData?.userId && (
            <Button
              variant='contained'
              color='info'
              onClick={() =>
                handleRedirect(`/boards/${params.type}/edit/` + id)
              }>
              수정
            </Button>
          )}
        </Stack>
        <Stack gap={1}>
          <Owner username={user.username} />
        </Stack>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <SunEditorViewer
          content={content}
          wrapSx={{
            overflow: "auto",
          }}
          sx={{
            minHeight: "50vh",
          }}
        />
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

export default BoardDetail;
