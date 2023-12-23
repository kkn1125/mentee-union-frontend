import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

type PlaceholderType = {
  width: number;
  height: number;
  src?: string;
  alt?: string;
  color?: string;
  maxWidth?: boolean;
};

function Placeholder({
  width,
  height,
  src,
  alt = "placeholder",
  color = "#afafaf",
  maxWidth = false,
}: PlaceholderType) {
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setPlaceholder(createPlaceholderUrl(width, height, color));
  }, [src, width, height]);

  function createPlaceholderUrl(width: number, height: number, color: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = color + (src ? "00" : "");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  return src || placeholder ? (
    <Box
      component='img'
      src={placeholder}
      alt={alt}
      width={maxWidth ? "100%" : width}
      height={height}
      sx={{
        backgroundImage: `url(${src})`,
        backgroundPosition: "top center",
        backgroundSize: "cover",
      }}
    />
  ) : (
    <Box
      component='div'
      sx={{
        width: maxWidth ? "100%" : width,
        height: height,
        backgroundColor: "#56565656",
      }}
    />
  );
}

export default Placeholder;
