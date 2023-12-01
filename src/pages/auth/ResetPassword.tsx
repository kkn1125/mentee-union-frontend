import { axiosInstance } from "@/util/instances";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import Loading from "@/components/atoms/Loading";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("이메일 형식이 아닙니다.")
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  password: yup
    .string()
    .min(5, "비밀번호는 최소 5자 이상 입력 해야합니다.")
    .max(20, "비밀번호는 최대 20자 이하 입력 해야합니다.")
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  checkPassword: yup
    .string()
    .min(5, "비밀번호는 최소 5자 이상 입력 해야합니다.")
    .max(20, "비밀번호는 최대 20자 이하 입력 해야합니다.")
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  token: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
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

      const emailMatched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
      );
      const passwordMatched = values.password.match(
        /(?=.*[A-Z])(?=.*[a-z])[A-Za-z]{1,}(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{0,}(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{4,20}/g
      );
      const checkPasswordMatched = values.password.match(
        /(?=.*[A-Z])(?=.*[a-z])[A-Za-z]{1,}(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{0,}(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{4,20}/g
      );
      const isSamecheckPasswordAsOrigin =
        values.checkPassword === values.password;

      if (!emailMatched || emailMatched[0] !== values.email) {
        errors.email = "이메일 형식이 아닙니다.";
      }
      if (!passwordMatched || passwordMatched[0] !== values.password) {
        errors.password =
          "비밀번호는 숫자, 영문 대소문자, 특수문자가 최소 1개 씩 포함되어야 하며, 5 ~ 20자 이내로 작성해야 합니다.";
      }
      if (
        !checkPasswordMatched ||
        checkPasswordMatched[0] !== values.checkPassword
      ) {
        errors.checkPassword =
          "비밀번호는 숫자, 영문 대소문자, 특수문자가 최소 1개 씩 포함되어야 하며, 5 ~ 20자 이내로 작성해야 합니다.";
      }
      if (!isSamecheckPasswordAsOrigin) {
        errors.checkPassword = "입력한 비밀번호와 동일하지 않습니다.";
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
            alert(
              "비밀번호 재설정이 완료되었습니다. 다시 로그인을 시도해주세요."
            );
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
            alert("등록되지 않은 메일 입니다.");
          } else {
            if (detail === "no exists session" && message === "access denied") {
              alert("잘못된 접근 입니다. 홈으로 돌아갑니다.");
              navigate("/");
            } else if (
              detail === "wrong token" &&
              message === "access denied"
            ) {
              alert("잘못된 접근입니다. 홈으로 돌아갑니다.");
              navigate("/");
            } else if (
              detail === "token expired" &&
              message === "access denied"
            ) {
              alert(
                "작업 유효 기간이 지났습니다. 사용자의 계정 보호를 위해 작업을 다시 진행해주세요. 홈으로 돌아갑니다."
              );
              navigate("/");
            } else {
              alert(
                "서버에 문제가 발생했습니다. 문제가 계속해서 발생한다면 관리자에게 문의해주세요."
              );
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
      alert("잘못된 접근입니다.");
      navigate("/");
      return;
    }

    const decodedUrlParams = new URLSearchParams(decodeURIComponent(q));

    const email = decodedUrlParams.get("e");
    const token = decodedUrlParams.get("tkn");

    if (!(email && token)) {
      alert("잘못된 접근입니다.");
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
