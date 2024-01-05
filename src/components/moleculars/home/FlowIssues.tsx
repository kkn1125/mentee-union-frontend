import { Stack } from "@mui/material";
import RowIssues from "./RowIssues";

const LIMIT = 10;

function FlowIssues({ issues, height }: FlowIssuesProps) {
  const dummies = [
    ...issues,
  ]; /* .concat(...[...new Array(50 - issues.length)].fill({})); */

  return (
    <Stack
      gap={3}
      sx={{
        perspective: 700,
        transform: "rotateX(15deg) rotateY(30deg) rotateZ(20deg)",
        userSelect: "none",
        height,
      }}>
      {dummies
        .reduce((acc: Issue[][], cur: Issue) => {
          if (acc.length !== 0 && acc[acc.length - 1].length < LIMIT) {
            acc[acc.length - 1].push(cur);
          } else {
            acc.push([cur]);
          }
          return acc;
        }, [] as Issue[][])
        .slice(0, 4)
        .filter((x) => x.length > 0)
        .map((issueRow: Issue[], i) => (
          <RowIssues
            key={"w" + i}
            dir={i % 2 === 0 ? "right" : "left"}
            issues={issueRow}
            limit={LIMIT}
          />
        ))}
    </Stack>
  );
}

export default FlowIssues;
