import Loading from "@/components/atoms/Loading";
import { axiosInstance } from "@/util/instances";
import { Button, Container, Paper, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("이메일 형식이 아닙니다.")
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
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
        errors.email = "이메일 형식이 아닙니다.";
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
          alert("비밀번호 재설정 메일을 전송했습니다. 메일을 확인 해 주세요.");
        })
        .catch((err) => {
          const message = err.response.data.message;
          if (
            message ===
            "This email is not registered. You must use the email that was used for registration."
          ) {
            alert("등록되지 않은 메일 입니다.");
          } else {
            alert("서버에 문제가 발생했습니다.");
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
      {loading && <Loading />}
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
            메일 전송
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
