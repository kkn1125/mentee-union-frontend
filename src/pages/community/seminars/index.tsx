import Loading from "@/components/atoms/Loading";
import SeminarItem from "@/components/atoms/SeminarItem";
import { axiosInstance } from "@/util/instances";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Seminars() {
  const navigate = useNavigate();
  const [seminars, setSeminars] = useState<Seminar[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/seminars")
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminars(data);
      });
  }, []);

  // const handleRedirectSeminar = (path: number) => {
  //   navigate(`${path}`);
  // };

  function handleRedirect(path: string) {
    navigate(path);
  }

  return seminars.length === 0 ? (
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
          to='/community/seminars'
          sx={{
            textDecoration: "inherit",
            textTransform: "inherit",
            color: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
          }}>
          seminars
        </Typography>
      </Typography>
      <List>
        {/* 세미나 항목 */}
        {/* 더 많은 세미나 항목들 */}
        {seminars.length === 0 && "등록된 세미나가 없습니다."}
        {seminars.map((seminar: Seminar) => (
          <SeminarItem
            key={seminar.id}
            seminar={seminar}
            onClick={() => handleRedirect("/community/seminars/" + seminar.id)}
          />
        ))}
      </List>
    </Stack>
  );
}

export default Seminars;
