import Loading from "@/components/atoms/Loading";
import Section from "@/components/moleculars/Section";
import { axiosInstance } from "@/util/instances";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Community() {
  const navigate = useNavigate();
  const [forums, setForums] = useState<Forum[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);

  useEffect(() => {
    axiosInstance.get("/forums").then(({ data: { data } }) => {
      setForums(data);
    });
    axiosInstance.get("/seminars").then(({ data: { data } }) => {
      setSeminars(data);
      console.log(data);
    });
  }, []);

  const handleRedirectSeminar = (path: number) => {
    navigate(`/community/seminars/${path}`);
  };

  return forums.length > 0 || seminars.length > 0 ? (
    <>
      {/* forum */}
      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>forums</Typography>
        <Stack gap={3}>
          {forums.length === 0 && "등록된 포럼이 없습니다."}
          {forums.map((forum) => (
            <Paper key={forum.id}>
              <Typography>{forum.title}</Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>

      {/* seminars */}
      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>seminars</Typography>
        <Stack gap={3}>
          {seminars.length === 0 && "등록된 세미나가 없습니다."}
          {seminars.map((forum) => (
            <Paper
              key={forum.id}
              onClick={() => handleRedirectSeminar(forum.id)}
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

      {/* mentoring */}
      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>mentoring</Typography>
        <Stack gap={3}>내용 교체</Stack>
      </Stack>
    </>
  ) : (
    <Loading />
  );
}

export default Community;
