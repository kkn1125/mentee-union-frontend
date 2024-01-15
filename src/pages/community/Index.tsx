import LinkTitle from "@/components/atoms/common/LinkTitle";
import Loading from "@/components/atoms/common/Loading";
import ForumCardList from "@/components/atoms/forum/ForumCardList";
import SeminarCardList from "@/components/atoms/seminar/SeminarCardList";
import { axiosInstance } from "@/util/instances";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SHOW_LIMIT = 4;

function Community() {
  const navigate = useNavigate();
  const [forums, setForums] = useState<Forum[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get("/forums"),
      axiosInstance.get("/seminars"),
    ]).then(([{ data: forumData }, { data: seminarData }]) => {
      setForums(forumData.data.slice(0, 5));
      setSeminars(seminarData.data.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const handleRedirect = (path: string | number) => {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <Stack gap={3}>
      {/* mentoring */}
      <Stack flex={1} gap={1}>
        <Typography variant='h4' textTransform={"capitalize"}>
          mentoring
        </Typography>
        <Stack gap={3}>
          <Typography variant='body2'>
            관심사 매칭을 통해 멘토/멘티와 소통해보세요!
          </Typography>
          <Box>
            <Button
              variant='contained'
              onClick={() => handleRedirect(`/community/mentoring`)}>
              매칭하기
            </Button>
          </Box>
        </Stack>
      </Stack>

      {/* seminars */}
      <Stack flex={1} gap={1}>
        <LinkTitle title='seminars' to='/community/seminars' />
        <SeminarCardList
          emptyText='등록된 세미나가 없습니다.'
          seminars={seminars.slice(0, SHOW_LIMIT)}
        />
      </Stack>

      {/* forums */}
      <Stack flex={1} gap={1}>
        <LinkTitle title='forums' to='/community/forums' />
        <Stack gap={2} sx={{ minHeight: "90%" }}>
          <ForumCardList
            emptyText='등록된 포럼 기사가 없습니다.'
            forums={forums.slice(0, SHOW_LIMIT)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Community;
