import { Stack } from "@mui/material";
import RowIssues from "./RowIssues";

function FlowIssues({ issues, width, height }: FlowIssuesProps) {
  const dummies = issues.concat(...[...new Array(50 - issues.length)].fill({}));

  return (
    <Stack
      sx={{
        width: "100%",
        height,
        position: "relative",
        perspective: 700,
        transform: "rotateX(15deg) rotateY(30deg) rotateZ(20deg)",
        userSelect: "none",
      }}>
      <Stack
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={3}
        sx={{
          width: width,
          height,
        }}>
        {dummies
          .reduce((acc: Issue[][], cur: Issue) => {
            if (acc.length !== 0 && acc[acc.length - 1].length < 3) {
              acc[acc.length - 1].push(cur);
            } else {
              acc.push([cur]);
            }
            return acc;
          }, [] as Issue[][])
          .slice(0, 3)
          .map((issueRow: Issue[], i) => (
            <RowIssues
              key={"w" + i}
              dir={i % 2 === 0 ? "right" : "left"}
              issues={issueRow}
            />
          ))}
      </Stack>
    </Stack>
  );
}

export default FlowIssues;
