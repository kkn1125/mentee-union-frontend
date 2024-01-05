import { Paper, Stack, Typography, keyframes } from "@mui/material";

function RowIssues({
  issues,
  dir = "right",
  limit,
}: {
  issues: Issue[];
  dir?: "left" | "right";
  limit: number;
}) {
  const cardWidth = 150; // 카드 너비
  const gap = 24; // gap
  const totalWidth = (cardWidth + gap) * issues.length; // 전체 너비 계산
  const animationDuration = limit * 2 * (totalWidth / 1000); // 10배수로 지속시간 조정

  const offset = cardWidth + gap; // offset

  const flow =
    dir === "right"
      ? keyframes`
      from { transform: translateX(-${totalWidth + offset}px) }
      to { transform: translateX(-${offset}px) }
      `
      : keyframes`
      from { transform: translateX(-${offset}px) }
      to { transform: translateX(-${totalWidth + offset}px) }
      `;

  const list = [...issues, ...issues, ...issues];

  return (
    <Stack
      direction='row'
      gap={3}
      flexWrap={"nowrap"}
      sx={{
        position: "relative",
        animation: `${flow} ${animationDuration}s infinite linear both`,
      }}>
      {list.map((issue: Issue, i) => (
        <Paper key={"issue" + i} sx={{ minWidth: 150, p: 2 }}>
          <Typography>{issue.title}</Typography>
          <Typography>{issue.content.slice(0, 10) + "..."}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}

export default RowIssues;
