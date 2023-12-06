import { TokenContext } from "@/context/TokenProvider";
import { CHECK_MESSAGE } from "@/util/global.constants";
import { Box, Typography, Button } from "@mui/material";
import React, { useContext } from "react";
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
        backgroundImage: `url(${
          src || "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
      }}>
      <Typography variant='h3' gutterBottom>
        성장을 함께하는 멘티 커뮤니티
      </Typography>
      <Typography variant='h6' sx={{ px: 3 }}>
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
