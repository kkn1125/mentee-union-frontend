import { Paper, Stack, Typography } from "@mui/material";

interface PaperContentProps {
  title: string;
  content: string;
}

function PaperContent({ title, content }: PaperContentProps) {
  return (
    <Paper component={Stack} gap={1} sx={{ p: 3 }} elevation={5}>
      <Typography variant='h5'>{title}</Typography>
      <Typography variant='body2'>{content}</Typography>
    </Paper>
  );
}

export default PaperContent;
