import { TokenContext } from "@/context/TokenProvider";
import { CHECK_MESSAGE } from "@/util/global.constants";
import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface BackgroundSectionProps {
  src?: string;
}

function BackgroundSection({ src }: BackgroundSectionProps) {
  const navigate = useNavigate();
  const token = useContext(TokenContext);

  return (
    <Box
      sx={{
        width: "100%",
        height: "75vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "#232323",
        backgroundColor: "#b7dbdf",
      }}>
      <Box
        sx={{
          backgroundImage: `url(${
            src || "/assets/cover/dalle-mentee-union-main-cover-edit.png"
          })`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: "blur(1.5px)",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
      <Typography
        variant='h3'
        gutterBottom
        sx={{
          zIndex: 1,
        }}>
        성장을 함께하는 멘티 커뮤니티
      </Typography>
      <Typography variant='h6' sx={{ px: 3, zIndex: 1 }}>
        멘티들이 모여 세미나와 지식을 공유하며, 멘토링 기회를 얻는 곳입니다.
      </Typography>
      <Button
        variant='contained'
        size='large'
        sx={{ mt: 2 }}
        onClick={() =>
          token.token
            ? navigate("community")
            : navigate(
                confirm(CHECK_MESSAGE.REQUIRED_SIGN_IN) ? "/auth/signin" : "/"
              )
        }>
        지금 시작하기
      </Button>
    </Box>
  );
}

export default BackgroundSection;
