import {
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { ERROR_MESSAGE, FAIL_MESSAGE, REGEX } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Input,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useState } from "react";
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
  keep_sign: yup.boolean().typeError(ERROR_MESSAGE.ONLY_BOOLEAN),
});

function Signin() {
  const [signing, setSigning] = useState(false);
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const navigate = useNavigate();
  const locate = useLocation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      keep_sign: false,
    },
    validationSchema: validationSchema,
    validate(values) {
      // console.log(values);
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
      setSigning(true);
      axiosInstance
        .post(
          "/auth/signin",
          {
            email: values.email,
            password: values.password,
          },
          {
            timeout: 5000,
            timeoutErrorMessage: "서버 요청 시간이 초과되었습니다.",
          }
        )
        .then(({ data: { data } }) => {
          const { access_token, refresh_token } = data;
          tokenDispatch({
            type: TOKEN_ACTION.SAVE,
            token: access_token,
            refresh: refresh_token,
            keep_sign: values.keep_sign,
          });
          navigate("/");
        })
        .catch((error) => {
          if (error.message === "Network Error") {
            alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN);
            return;
          }
          const data = (error as CustomAxiosError).response.data;
          switch (data.message) {
            case "email authentication required":
              alert(FAIL_MESSAGE.REQUIRE_EMAIL_AUTH);
              break;
            case "user not found":
              // alert(FAIL_MESSAGE.NO_ACCOUNT);
              alert(FAIL_MESSAGE.INCORRECT_ACCOUNT_INFO(-1));
              break;
            case "Incorrect email or password. You have n attempts left. Please try again.":
              alert(FAIL_MESSAGE.INCORRECT_ACCOUNT_INFO(+data.detail, 3));
              formik.setValues({
                email: formik.values.email,
                password: "",
                keep_sign: formik.values.keep_sign,
              });
              break;
            case "You have exceeded the maximum number of login attempts. Please try again later.":
              alert(FAIL_MESSAGE.LOCKED_ACCOUNT_REQUIRED_RESET);
              formik.setValues({
                email: formik.values.email,
                password: "",
                keep_sign: formik.values.keep_sign,
              });
              break;
            default:
              alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
              break;
          }
        })
        .finally(() => {
          setSigning(false);
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
            sx={{
              position: "relative",
              mb: 2,
            }}
            FormHelperTextProps={{
              sx: {
                position: "absolute",
                top: "100%",
                left: 0,
              },
            }}
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
            sx={{
              position: "relative",
              mb: 3,
            }}
            FormHelperTextProps={{
              sx: {
                position: "absolute",
                top: "100%",
                left: 0,
              },
            }}
          />

          <Button
            type='submit'
            variant='contained'
            sx={{
              height: 36.5,
            }}>
            {signing ? (
              <CircularProgress size={25} color='inherit' />
            ) : (
              "로그인"
            )}
          </Button>
          <Button
            type='button'
            variant='contained'
            color='info'
            onClick={() => navigate("/auth/signup")}>
            계정이 없으신가요?
          </Button>
          <Stack
            direction='row'
            gap={3}
            justifyContent={"space-between"}
            alignItems='center'
            sx={{
              userSelect: "none",
            }}>
            <Box
              component={Link}
              type='button'
              to={`/auth/request-pass?r=${encodeURIComponent(locate.pathname)}`}
              color='success'
              sx={{
                pt: 0.5,
                color: "inherit",
                textDecoration: "none",
                fontSize: (theme) => theme.typography.pxToRem(12),
              }}>
              비밀번호 찾기
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name='keep_sign'
                    size='small' /* defaultChecked */
                    value={formik.values.keep_sign}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                }
                label='로그인 유지'
                labelPlacement='start'
                sx={{ alignItems: "center" }}
                componentsProps={{
                  typography: {
                    sx: {
                      display: "inline-block",
                      pt: 0.5,
                      fontSize: (theme) => theme.typography.pxToRem(12),
                    },
                  },
                }}
              />
            </FormGroup>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Signin;
