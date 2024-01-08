import { Box, SxProps, Typography } from "@mui/material";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

type SunEditorViewerProps = {
  content: string;
  sx?: SxProps;
  wrapSx?: SxProps;
};

function SunEditorViewer({ content, wrapSx, sx }: SunEditorViewerProps) {
  return (
    <Box
      className='sun-editor'
      sx={{
        border: "none",
        ...wrapSx,
        color: "inherit",
        backgroundColor: "transparent",
      }}>
      <Typography
        className='se-container sun-editor-editable'
        variant='body2'
        dangerouslySetInnerHTML={{
          __html: content.replace(/<script|^<.*\s?onload=/gm, ""),
        }}
        sx={{
          p: 0,
          color: "inherit",
          backgroundColor: "transparent",
          ...sx,
        }}
      />
    </Box>
  );
}

export default SunEditorViewer;
