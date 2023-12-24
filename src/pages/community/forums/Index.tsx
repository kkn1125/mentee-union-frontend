import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import { Stack, Typography, Paper, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  const [forums, setForums] = useState<Forum[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/forums")
      .then(({ data }) => data.data)
      .then((data) => {
        setForums(data);
      });
  }, []);

  const handleRedirect = (path: string) => {
    navigate(path);
  };

  return forums.length === 0 ? (
    <Loading />
  ) : (
    <Stack flex={1} gap={1}>
      <Box>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/community")}>
          커뮤니티 돌아가기
        </Button>
      </Box>
      <Typography
        variant='h4'
        textTransform={"capitalize"}
        sx={{
          textDecoration: "none",
          color: "inherit",
        }}>
        <Typography
          component={Link}
          to='/community/forums'
          sx={{
            textDecoration: "inherit",
            textTransform: "inherit",
            color: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
          }}>
          forums
        </Typography>
      </Typography>
      <Stack gap={3}>
        {forums.length === 0 && "등록된 포럼이 없습니다."}
        {forums.map((forum) => (
          <Paper
            key={forum.id}
            onClick={() => handleRedirect("/community/forums/" + forum.id)}
            sx={{ p: 3, cursor: "pointer" }}>
            <Typography variant='h6' component='h6'>
              {forum.title}
            </Typography>
            <Typography variant='body1'>{forum.content}</Typography>
            <Typography variant='body2'>{forum.user.username}</Typography>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

export default Index;
