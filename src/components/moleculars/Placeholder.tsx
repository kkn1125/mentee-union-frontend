import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

type PlaceholderType = {
  width: number;
  height: number;
  alt?: string;
  color?: string;
  maxWidth?: boolean;
};

function Placeholder({
  width,
  height,
  alt = "placeholder",
  color = "#565656",
  maxWidth = false,
}: PlaceholderType) {
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    setPlaceholder(createPlaceholderUrl(width, height, color));
  }, [width, height]);

  function createPlaceholderUrl(width: number, height: number, color: string) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  return (
    <Box
      component='img'
      src={placeholder}
      alt={alt}
      width={maxWidth ? "100%" : width}
      height={height}
    />
  );
}

export default Placeholder;
