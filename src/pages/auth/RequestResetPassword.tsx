import {
  ERROR_MESSAGE,
  FAIL_MESSAGE,
  SUCCESS_MESSAGE,
} from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email(ERROR_MESSAGE.EMAIL_FORMAT)
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
});

function RequestResetPassword() {
  const locate = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(locate.search);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: { email?: string } = {};
      const emailMatched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
      );
      if (!emailMatched || emailMatched[0] !== values.email) {
        errors.email = ERROR_MESSAGE.EMAIL_FORMAT;
      }
      return errors;
    },
    onSubmit: (values) => {
      setLoading(true);
      axiosInstance
        .post(`/mailer/reset`, {
          email: values.email,
        })
        .then(({ data }) => {
          console.log(data);
          // navigate("/");
          alert(SUCCESS_MESSAGE.SEND_RESET_PASSWORD_MAIL_CHECK);
        })
        .catch((err) => {
          const message = err.response.data.message;
          if (
            message ===
            "This email is not registered. You must use the email that was used for registration."
          ) {
            alert(FAIL_MESSAGE.UNREGISTERD_EMAIL);
          } else {
            alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    window.addEventListener("beforeunload", leaveCurrentPageMessage);
    return () => {
      window.removeEventListener("beforeunload", leaveCurrentPageMessage);
    };
  }, []);

  function leaveCurrentPageMessage(e: BeforeUnloadEvent) {
    e.returnValue = "페이지를 벗어나시겠습니까?";
  }

  function handleRedirect() {
    const r = params.get("r");
    if (r) {
      navigate(decodeURIComponent(r));
    } else {
      navigate("/");
    }
  }

  return (
    <Container
      maxWidth='xs'
      sx={{
        flex: 1,
      }}>
      <Paper
        component={Stack}
        sx={{
          py: 5,
          px: 7,
        }}>
        <Stack component='form' gap={1} onSubmit={formik.handleSubmit}>
          <TextField
            focused
            size='small'
            name='email'
            label='email'
            type='email'
            autoComplete='username'
            fullWidth
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button type='submit' variant='contained' color='info'>
            {loading ? (
              <CircularProgress size={24.5} color='inherit' sx={{ mx: 2 }} />
            ) : (
              "메일 전송"
            )}
          </Button>
          <Button
            type='button'
            variant='contained'
            color='secondary'
            onClick={handleRedirect}>
            이전 페이지
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default RequestResetPassword;
