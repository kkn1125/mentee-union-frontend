import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditorViewer from "../common/SunEditorViewer";

type ForumCardProps = {
  forum: Forum;
  forumCardAmount: number;
};

function ForumCard({ forum, forumCardAmount }: ForumCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleCopyLink(link: string) {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <Paper
      sx={{
        width: `calc(100% / ${forumCardAmount} - (16px * ${
          (forumCardAmount - 1) / forumCardAmount
        }))`,
      }}>
      <Stack gap={1} sx={{ p: 2 }}>
        <Typography variant='h6' textTransform='capitalize'>
          {forum.title}
        </Typography>
        <SunEditorViewer
          content={forum.content}
          sx={{
            overflow: "hidden",
            minHeight: "5em",
            maxHeight: "5em",
          }}
        />
      </Stack>
      <Divider sx={{ borderColor: "#565656" }} />
      <Stack
        direction='row'
        justifyContent={"space-between"}
        gap={1}
        sx={{ p: 2 }}>
        <Tooltip title='상세 보기' placement='top'>
          <IconButton
            size='small'
            color='info'
            onClick={() => handleRedirect("/community/forums/" + forum.id)}>
            <ArticleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={copied ? "복사 완료" : "링크 복사"}
          placement='top'
          onClick={() =>
            handleCopyLink(location.origin + "/community/forums/" + forum.id)
          }>
          <IconButton size='small' color={copied ? "success" : "info"}>
            {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}

export default ForumCard;
