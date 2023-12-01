import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { axiosInstance } from "@/util/instances";
import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

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
});

function Signin() {
  const tokenDispatch = useContext(TokenDispatchContext);
  const navigate = useNavigate();
  const locate = useLocation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: { email?: string } = {};
      const matched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
      );
      if (!matched || matched[0] !== values.email) {
        errors.email = "email must be a valid email";
      }
      return errors;
    },
    onSubmit: (values) => {
      axiosInstance
        .post("/auth/signin", {
          email: values.email,
          password: values.password,
        })
        .then(({ data: { data } }) => {
          const { access_token, refresh_token } = data;
          tokenDispatch({
            type: TOKEN_ACTION.SAVE,
            token: access_token,
            refresh: refresh_token,
          });
          navigate("/");
        })
        .catch((err: unknown) => {
          const data = (err as CustomAxiosError).response.data;
          switch (data.message) {
            case "email authentication required":
              alert("이메일 본인인증이 필요합니다.");
              break;
            case "user not found":
              alert("회원정보가 없습니다.");
              break;
            case "Incorrect email or password. You have n attempts left. Please try again.":
              alert(
                `이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.\n남은 로그인 시도 횟수: ${
                  data.detail || 0
                }${
                  (+data.detail || 0) < 3
                    ? "\n알림: 모든 횟수를 소진하면 계정이 잠깁니다."
                    : ""
                }`
              );
              formik.setValues({
                email: formik.values.email,
                password: "",
              });
              break;
            case "You have exceeded the maximum number of login attempts. Please try again later.":
              alert(
                `잠긴 계정입니다. 이메일을 통해 비밀번호를 재설정 해주세요.`
              );
              formik.setValues({
                email: formik.values.email,
                password: "",
              });
              break;
            default:
              alert("서버에 문제가 발생 했습니다.");
              break;
          }
        });
    },
  });

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
            size='small'
            name='email'
            label='email'
            type='email'
            autoComplete='username'
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            size='small'
            name='password'
            label='password'
            type='password'
            autoComplete='current-password'
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button type='submit' variant='contained'>
            로그인
          </Button>
          <Button
            type='button'
            variant='contained'
            color='info'
            onClick={() => navigate("/auth/signup")}>
            계정이 없으신가요?
          </Button>
          <Box
            component={Link}
            type='button'
            to={`/auth/request-pass?r=${encodeURIComponent(locate.pathname)}`}
            color='success'
            sx={{
              textDecoration: "none",
              fontSize: (theme) => theme.typography.pxToRem(12),
            }}>
            비밀번호 찾기
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Signin;
