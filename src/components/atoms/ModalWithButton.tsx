import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Modal,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";

function ModalWithButton({
  label,
  title,
  content,
  buttonProps,
  boxProps,
}: {
  label: string | ReactNode | ReactNode[];
  title: string | ReactNode | ReactNode[];
  content: string | ReactNode | ReactNode[];
  buttonProps?: Partial<ButtonProps>;
  boxProps?: Partial<BoxProps>;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen} {...buttonProps}>
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
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            {content}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default ModalWithButton;
