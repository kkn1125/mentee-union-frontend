import { Box, SxProps, Theme, Typography } from "@mui/material";

interface GaugeBarType {
  width?: number;
  height?: number;
  value?: number;
  maxValue?: number;
  sx?: SxProps<Theme>;
}

function GaugeBar({
  width = 0,
  height = 25,
  value = 50,
  maxValue = 50,
  sx,
}: GaugeBarType) {
  const barValue = ((value / maxValue) * 100).toFixed(1);
  return (
    <Box
      sx={{
        position: "relative",
        height: height,
        overflow: "hidden",
        ...(width && { width }),
        ...sx,
        borderRadius: 1,
        display: "flex",
      }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#868686",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${barValue}%`,
          backgroundColor: (theme) => theme.palette.success.main,
          maxWidth: "100%",
        }}>
        <Typography
          component='div'
          variant='body2'
          sx={{
            lineHeight: 1,
            userSelect: "none",
            position: "absolute",
            top: "50%",
            textWrap: "nowrap",
            width: "100%",
            textAlign: "right",
            px: (theme) => theme.typography.pxToRem(12),
            transform: "translateY(-50%)",
            color: (theme) => theme.palette.background.default,
            fontSize: "inherit",
          }}>
          {value}/{maxValue} ({barValue}%){/* {barValue}% */}
        </Typography>
      </Box>
    </Box>
  );
}

export default GaugeBar;
