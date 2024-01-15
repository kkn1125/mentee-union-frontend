import BoardCard from "@/components/atoms/board/BoardCard";
import Loading from "@/components/atoms/common/Loading";
import { TokenContext } from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { boardType } from "@/util/global.constants";
import { axiosInstance, store } from "@/util/instances";
import { overwrite, overwriteWith } from "@/util/tool";
import { Box, Button, List, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const logger = new Logger(Board.name);

function Board() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const params = useParams();
  const [profileData, setProfileData] = useState<JwtDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [boardList, setBoardList] = useState<Board[]>([]);

  useEffect(() => {
    logger.debug("check already loaded", boardList, profileData);
    if (token.token) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    getBoardItems();
    return () => {
      setLoading(true);
      setBoardList([]);
      setProfileData(null);
    };
  }, [params.type]);

  function getProfile() {
    axiosInstance
      .get("/auth/profile", {
        headers: { Authorization: "Bearer " + token.token },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        const profiles = overwrite(store.profile, data);
        store.profile = profiles;
        setProfileData(profiles);
      });
  }

  function getBoardItems() {
    axiosInstance
      .get("/boards/" + params.type, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        setLoading(false);
        // const boardOverwrites = overwriteWith(store.boards, data);
        // const typedBoards = boardOverwrites.filter(
        //   (_) => _.type === params.type
        // );
        setBoardList(data);
        // store.boards = boardOverwrites;
      });
  }

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  const boardName = (() => {
    switch (params.type) {
      case "event":
        return "이벤트가";
      case "qna":
        return "질의응답이";
      case "notice":
        return "공지사항이";
      default:
        return "게시글이";
    }
  })();

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack flex={1} gap={1} alignSelf='stretch'>
      <Stack direction='row' justifyContent='space-between' gap={1}>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/")}>
          메인페이지로 돌아가기
        </Button>
        {params.type === "qna" && profileData && (
          <Box>
            <Button
              variant='contained'
              color='info'
              onClick={() => handleRedirect(`/boards/${params.type}/edit`)}>
              등록
            </Button>
          </Box>
        )}
      </Stack>
      <List>
        <Stack gap={2}>
          <Typography variant='h5'>
            {boardType[params.type as BOARD_TYPE]}
          </Typography>
          {boardList.length === 0 && (
            <Typography>등록된 {boardName} 없습니다.</Typography>
          )}
          {boardList.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </Stack>
      </List>
    </Stack>
  );
}

export default Board;
