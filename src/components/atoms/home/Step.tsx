import { Stack, Typography } from "@mui/material";

interface StepProps {
  order: number;
  title: string;
  content: string;
}

function Step({ order, title, content }: StepProps) {
  return (
    <Stack flex={1}>
      <Typography variant='h5'>
        {title}
        {order}
      </Typography>
      <Typography variant='body2'>{content}</Typography>
    </Stack>
  );
}

export default Step;
