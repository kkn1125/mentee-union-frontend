import Loading from "@/components/atoms/Loading";
import { TokenContext } from "@/context/TokenProvider";
import { axiosInstance } from "@/util/instances";
import { timeFormat } from "@/util/tool";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ForumDetail() {
  const navigate = useNavigate();
  const [forum, setForum] = useState<Forum | null>(null);
  const params = useParams();
  const token = useContext(TokenContext);

  useEffect(() => {
    axiosInstance
      .get(`/forums/${params.id}`)
      .then(({ data }) => data.data)
      .then((data) => {
        setForum(data);
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
    deleted_at,
    created_at,
    updated_at,
    user,
  } = forum;

  function handleRedirect(path: string) {
    navigate(path);
  }

  return (
    <Container maxWidth='md'>
      <Button
        variant='contained'
        color='info'
        onClick={() => handleRedirect("/community/forums")}>
        포럼 둘러보기
      </Button>
      <Paper elevation={3} sx={{ p: 3, marginTop: 2 }}>
        <Typography variant='h4' gutterBottom>
          {title}
        </Typography>
        <Stack gap={1}>
          <Stack direction='row' alignItems='center'>
            <AccountCircleIcon />
            <Typography>{user.username}</Typography>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2, borderColor: "#565656" }} />
        <Typography variant='body1' paragraph minHeight={"50vh"}>
          {content}
        </Typography>
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
