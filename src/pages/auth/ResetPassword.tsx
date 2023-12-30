import Loading from "@/components/atoms/common/Loading";
import {
  ERROR_MESSAGE,
  FAIL_MESSAGE,
  REGEX,
  SUCCESS_MESSAGE,
} from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Button, Container, Paper, Stack, TextField } from "@mui/material";
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
  password: yup
    .string()
    .min(5, ERROR_MESSAGE.PASSWORD.MIN(5))
    .max(20, ERROR_MESSAGE.PASSWORD.MAX(20))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  checkPassword: yup
    .string()
    .min(5, ERROR_MESSAGE.PASSWORD.MIN(5))
    .max(20, ERROR_MESSAGE.PASSWORD.MAX(20))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  token: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
});

function ResetPassword() {
  const locate = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(locate.search);
  const [options, setOptions] = useState<{ email?: string; token?: string }>(
    {}
  );
  const formik = useFormik({
    initialValues: {
      email: "",
      token: "",
      password: "",
      checkPassword: "",
    },
    validationSchema: validationSchema,
    async validate(values) {
      const errors: {
        email?: string;
        password?: string;
        checkPassword?: string;
      } = {};

      const emailMatched = values.email.match(REGEX.EMAIL);
      const passwordMatched = values.password.match(REGEX.PASSWORD);
      const checkPasswordMatched = values.password.match(REGEX.PASSWORD);
      const isSamecheckPasswordAsOrigin =
        values.checkPassword === values.password;

      if (!emailMatched || emailMatched[0] !== values.email) {
        errors.email = ERROR_MESSAGE.EMAIL_FORMAT;
      }
      if (!passwordMatched || passwordMatched[0] !== values.password) {
        errors.password = ERROR_MESSAGE.PASSWORD.DEFAULT(5, 20);
      }
      if (
        !checkPasswordMatched ||
        checkPasswordMatched[0] !== values.checkPassword
      ) {
        errors.checkPassword = ERROR_MESSAGE.PASSWORD.DEFAULT(5, 20);
      }
      if (!isSamecheckPasswordAsOrigin) {
        errors.checkPassword = ERROR_MESSAGE.PASSWORD.NO_MATCHED_WITH_ORIGIN;
      }

      return errors;
    },
    onSubmit: (values) => {
      axiosInstance
        .put(`/users/reset`, {
          email: options.email,
          password: values.password,
          token: options.token,
        })
        .then(({ data }) => {
          if (data.message === "success reset password") {
            alert(SUCCESS_MESSAGE.RESET_PASSWORD);
            navigate("/auth/signin");
          }
        })
        .catch((err) => {
          const message = err.response.data.message;
          const detail = err.response.data.detail;
          if (
            message ===
            "This email is not registered. You must use the email that was used for registration."
          ) {
            alert(FAIL_MESSAGE.UNREGISTERD_EMAIL);
          } else {
            if (detail === "no exists session" && message === "access denied") {
              alert(FAIL_MESSAGE.ACCESS_DENIED_GOHOME);
              navigate("/");
            } else if (
              detail === "wrong token" &&
              message === "access denied"
            ) {
              alert(FAIL_MESSAGE.ACCESS_DENIED_GOHOME);
              navigate("/");
            } else if (
              detail === "token expired" &&
              message === "access denied"
            ) {
              alert(FAIL_MESSAGE.EXPIRED_WORK_GOHOME);
              navigate("/");
            } else {
              alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN);
              navigate("/");
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    const q = params.get("q");

    if (!q) {
      alert(FAIL_MESSAGE.ACCESS_DENIED);
      navigate("/");
      return;
    }

    const decodedUrlParams = new URLSearchParams(decodeURIComponent(q));

    const email = decodedUrlParams.get("e");
    const token = decodedUrlParams.get("tkn");

    if (!(email && token)) {
      alert(FAIL_MESSAGE.ACCESS_DENIED);
      navigate("/");
      return;
    }

    setOptions(() => ({
      email,
      token,
    }));

    formik.setValues({
      email,
      token,
      password: "",
      checkPassword: "",
    });

    window.addEventListener("beforeunload", leaveCurrentPageMessage);
    return () => {
      window.removeEventListener("beforeunload", leaveCurrentPageMessage);
    };
  }, []);

  function leaveCurrentPageMessage(e: BeforeUnloadEvent) {
    e.returnValue = "페이지를 벗어나시겠습니까?";
  }

  // function handleRedirect() {
  //   const r = params.get("r");
  //   if (r) {
  //     navigate(decodeURIComponent(r));
  //   } else {
  //     navigate("/");
  //   }
  // }

  return (
    <Container
      maxWidth='xs'
      sx={{
        flex: 1,
      }}>
      {loading && <Loading />}
      <Paper
        component={Stack}
        sx={{
          py: 5,
          px: 7,
        }}>
        <Stack component='form' gap={1} onSubmit={formik.handleSubmit}>
          <TextField
            disabled
            size='small'
            name='token'
            type='text'
            fullWidth
            sx={{ display: "none" }}
            value={formik.values.token}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.token && Boolean(formik.errors.token)}
            helperText={formik.touched.token && formik.errors.token}
          />
          <TextField
            focused
            disabled
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
          <TextField
            focused
            size='small'
            name='password'
            label='password'
            type='password'
            autoComplete='current-password'
            fullWidth
            value={formik.values.password}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            focused
            size='small'
            name='checkPassword'
            label='check password'
            type='password'
            autoComplete='new-password'
            fullWidth
            value={formik.values.checkPassword}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.checkPassword &&
              Boolean(formik.errors.checkPassword)
            }
            helperText={
              formik.touched.checkPassword && formik.errors.checkPassword
            }
          />
          <Button type='submit' variant='contained' color='info'>
            비밀번호 재설정
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ResetPassword;
