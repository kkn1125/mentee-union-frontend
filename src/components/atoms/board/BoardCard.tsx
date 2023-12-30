import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SunEditorViewer from "../common/SunEditorViewer";
import Owner from "../seminar/Owner";
import LockIcon from "@mui/icons-material/Lock";

type BoardCardProps = {
  board: Board;
};

function BoardCard({ board }: BoardCardProps) {
  const navigate = useNavigate();
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

  function handleRedirect(type: string, board_id: number) {
    navigate("/boards/" + type + "/" + board_id);
  }

  return (
    <Stack
      component={Paper}
      sx={{
        p: 2,
        cursor: "pointer",
      }}
      onClick={() => handleRedirect(type, id)}>
      <Stack
        direction='row'
        gap={1}
        justifyContent={"space-between"}
        alignItems='center'>
        <Typography gutterBottom variant='h5'>
          {title}
        </Typography>
        {!visible && (
          <Tooltip title='비공개 게시글' placement='top' color='success'>
            <IconButton>
              <LockIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Owner username={user.username} />
      <SunEditorViewer
        wrapSx={{
          mt: 3,
        }}
        content={content}
      />
    </Stack>
  );
}

export default BoardCard;
