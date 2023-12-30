import Loading from "@/components/atoms/common/Loading";
import SeminarCard from "@/components/atoms/seminar/SeminarCard";
import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Button, List, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Seminars() {
  const navigate = useNavigate();
  const tokenDispatch = useContext(TokenDispatchContext);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/seminars")
      .then(({ data }) => data.data)
      .then((data) => {
        setSeminars(data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          alert(
            FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN +
              "\n보안을 위해 로그인 정보는 삭제됩니다."
          );
          tokenDispatch({
            type: TOKEN_ACTION.SIGNOUT,
          });
          navigate("/");
        }
      });
  }, []);

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleWriteArticle() {
    navigate("/community/seminars/edit");
  }

  return loading ? (
    <Loading />
  ) : (
    <Stack flex={1} gap={1}>
      <Stack direction='row' justifyContent='space-between' gap={1}>
        <Button
          variant='contained'
          color='info'
          onClick={() => handleRedirect("/community")}>
          커뮤니티 돌아가기
        </Button>
        <Button variant='contained' color='info' onClick={handleWriteArticle}>
          글 작성
        </Button>
      </Stack>
      {/* <Typography
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
      </Typography> */}
      <List>
        {/* 세미나 항목 */}
        {/* 더 많은 세미나 항목들 */}
        {seminars.length === 0 && "등록된 세미나가 없습니다."}
        {seminars.map((seminar: Seminar) => (
          <SeminarCard key={seminar.id} seminar={seminar} />
        ))}
      </List>
    </Stack>
  );
}

export default Seminars;
