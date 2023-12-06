import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface CustomLinearProgressProps {
  value: number;
}

// 게이지 바 스타일 정의
const CustomLinearProgress = styled(LinearProgress)<CustomLinearProgressProps>(
  ({ theme }) => ({
    height: 10,
    backgroundColor: theme.palette.grey[700],
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[700],
    },
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: theme.palette.success.main,
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        right: 0,
        bottom: 0,
        width: "200%",
        backgroundImage:
          "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px)",
        animation: "moveBackground 3s linear infinite",
      },
    },
    "@keyframes moveBackground": {
      "0%": { transform: "translateX(0)" },
      "100%": { transform: "translateX(10.5%)" },
    },
  })
);

interface LevelSystemProps {
  level: number;
  points: number;
  maxPoints: number;
}

const LevelSystem: React.FC<LevelSystemProps> = ({
  level,
  points,
  maxPoints,
}) => {
  // 게이지 바에 채워질 비율 계산
  const normalise = (value: number): number =>
    (((value > maxPoints ? maxPoints : value) - 0) * 100) / (maxPoints - 0);

  return (
    <Box sx={{ padding: "16px", userSelect: "none" }}>
      <Typography variant='h6'>Level {level}</Typography>
      <CustomLinearProgress
        variant='determinate'
        value={normalise(points)}
        title={`${points}/${maxPoints} (${((points / maxPoints) * 100).toFixed(
          2
        )}%)`}
      />
      <Typography variant='body2' color='text.secondary'>
        {points}/{maxPoints} points
      </Typography>
      <Typography variant='caption' color='text.third'>
        다음 레벨까지 {maxPoints - points} 점 남았습니다!
      </Typography>
    </Box>
  );
};

export default LevelSystem;
