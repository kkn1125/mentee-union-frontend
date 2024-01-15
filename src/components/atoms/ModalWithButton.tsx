import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { MouseEventHandler, ReactNode, useState } from "react";

function ModalWithButton({
  label,
  title,
  content,
  buttonProps,
  boxProps,
  color = "info",
  onClick,
}: {
  label: string | ReactNode | ReactNode[];
  title: string | ReactNode | ReactNode[];
  content: string | ReactNode | ReactNode[];
  buttonProps?: Partial<ButtonProps>;
  boxProps?: Partial<BoxProps>;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant='contained'
        color={color}
        onClick={handleOpen}
        {...buttonProps}>
        {label}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        <Box
          {...boxProps}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            {title}
          </Typography>
          {typeof content === "string" ? (
            <Typography
              id='modal-modal-description'
              sx={{ mt: 2 }}
              dangerouslySetInnerHTML={{
                __html: content?.replace?.(/\n/, "<br />") || "",
              }}
            />
          ) : (
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              {content}
            </Typography>
          )}

          <Stack direction='row' gap={2} sx={{ mt: 2 }}>
            <Button
              variant='contained'
              color='success'
              onClick={(e) => {
                onClick?.(e);
                handleClose();
              }}>
              확인
            </Button>
            <Button variant='contained' color='inherit' onClick={handleClose}>
              취소
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalWithButton;
