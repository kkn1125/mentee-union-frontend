import BoardCard from "@/components/atoms/board/BoardCard";
import Loading from "@/components/atoms/common/Loading";
import { TokenContext } from "@/context/TokenProvider";
import { boardType } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Box, Button, List, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Board() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const params = useParams();
  const [profileData, setProfileData] = useState<JwtDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [boardList, setBoardList] = useState<Board[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/boards/" + params.type, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => data.data)
      .then((data) => {
        setBoardList(data);
        setLoading(false);
      });

    if (token.token) {
      axiosInstance
        .get("/auth/profile", {
          headers: { Authorization: "Bearer " + token.token },
        })
        .then(({ data }) => data.data)
        .then((data) => {
          setProfileData(data);
        });
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  return (
    <List>
      <Stack gap={2}>
        <Typography variant='h5'>
          {boardType[params.type as BOARD_TYPE]}
        </Typography>
        {boardList.length === 0 && (
          <Typography>등록된 게시글이 없습니다.</Typography>
        )}
        {boardList.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
        {params.type === "qna" && profileData && (
          <Box>
            <Button
              variant='contained'
              color='info'
              onClick={() => handleRedirect("/boards/qnd/edit")}>
              등록
            </Button>
          </Box>
        )}
      </Stack>
    </List>
  );
}

export default Board;
