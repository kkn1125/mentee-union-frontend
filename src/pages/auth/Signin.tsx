import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { FAIL_MESSAGE, ERROR_MESSAGE, REGEX } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
      const matched = values.email.match(REGEX.EMAIL);
      if (!values.email) {
        errors.email = ERROR_MESSAGE.REQUIRED;
      } else if (!matched || matched[0] !== values.email) {
        errors.email = ERROR_MESSAGE.EMAIL_FORMAT;
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
              alert(FAIL_MESSAGE.REQUIRE_EMAIL_AUTH);
              break;
            case "user not found":
              alert(FAIL_MESSAGE.NO_ACCOUNT);
              break;
            case "Incorrect email or password. You have n attempts left. Please try again.":
              alert(FAIL_MESSAGE.INCORRECT_ACCOUNT_INFO(+data.detail, 3));
              formik.setValues({
                email: formik.values.email,
                password: "",
              });
              break;
            case "You have exceeded the maximum number of login attempts. Please try again later.":
              alert(FAIL_MESSAGE.LOCKED_ACCOUNT_REQUIRED_RESET);
              formik.setValues({
                email: formik.values.email,
                password: "",
              });
              break;
            default:
              alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
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
