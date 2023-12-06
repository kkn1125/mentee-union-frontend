import { Paper, Stack, keyframes } from "@mui/material";
import React, { Fragment } from "react";

function RowIssues({
  issues,
  dir = "right",
}: {
  issues: Issue[];
  dir?: "left" | "right";
}) {
  const flow =
    dir === "right"
      ? keyframes`
      0%{ transform: translateX(-${
        issues.length * 10 + issues.length * 2 * 1
      }%) }
      100%{ transform: translateX(-0%)}
      `
      : keyframes`
      0%{ transform: translateX(0%) }
      100%{ transform: translateX(-${
        issues.length * 10 + issues.length * 2 * 1
      }%)}
      `;
  return (
    <Stack
      direction='row'
      gap={3}
      sx={{
        animation: `${flow} ${issues.length * 10}s infinite linear both`,
      }}>
      {[...issues]
        .concat(...issues)
        .concat(...issues)
        .map((issue: Issue, i) =>
          issue.id ? (
            <Paper key={"issue" + i} sx={{ flex: parseFloat(Math.random().toFixed(1)), p: 5 }}>
              {issue.title}
            </Paper>
          ) : (
            <Fragment key={"issue" + i}></Fragment>
          )
        )}
    </Stack>
  );
}

export default RowIssues;
