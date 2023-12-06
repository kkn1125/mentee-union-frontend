import Loading from "@/components/atoms/Loading";
import {
  ERROR_MESSAGE,
  FAIL_MESSAGE,
  REGEX,
  SUCCESS_MESSAGE,
} from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  FormHelperText,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(1, ERROR_MESSAGE.MIN(1))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
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
  phone_number: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  birth: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  gender: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
});

const options = ["male", "female", "none"];

function Signup() {
  const navigate = useNavigate();
  const [availableUsername, setAvailableUsername] = useState<
    boolean | undefined
  >(undefined);
  const [availableEmail, setAvailableEmail] = useState<boolean | undefined>(
    undefined
  );
  const [authEmailMessage, setAuthEmailMessage] = useState("");
  const [checkUsername, setCheckUsername] = useState<boolean>(false);
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const locate = useLocation();
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone_number: "",
      birth: "",
      gender: "",
    },
    validationSchema: validationSchema,
    async validate(values) {
      const errors: {
        username?: string;
        email?: string;
        password?: string;
        phone_number?: string;
      } = {};

      /* property match condition */
      const userMatched = values.username.match(REGEX.USERNAME);
      const emailMatched = values.email.match(REGEX.EMAIL);
      const passwordMatched = values.password.match(REGEX.PASSWORD);
      const phoneNumberMatched = values.phone_number.match(REGEX.PHONE_NUMBER);

      /* match confirm */
      if (values.username.length < 5 || values.username.length > 20) {
        errors.username = ERROR_MESSAGE.USERNAME.DEFAULT(5, 20);
      }
      if (!userMatched || userMatched[0] !== values.username) {
        if (userMatched) {
          if (userMatched[0] !== values.username) {
            errors.username = ERROR_MESSAGE.USERNAME.NOT_ALLOWED_START_WITH;
          } else {
            errors.username = ERROR_MESSAGE.USERNAME.DEFAULT(5, 20);
          }
        } else {
          errors.username = ERROR_MESSAGE.USERNAME.DEFAULT(5, 20);
        }
      }
      if (!emailMatched || emailMatched[0] !== values.email) {
        errors.email = ERROR_MESSAGE.EMAIL_FORMAT;
      }
      if (!passwordMatched || passwordMatched[0] !== values.password) {
        errors.password = ERROR_MESSAGE.PASSWORD.DEFAULT(5, 20);
      }
      if (
        !phoneNumberMatched ||
        phoneNumberMatched[0] !== values.phone_number
      ) {
        errors.phone_number = ERROR_MESSAGE.PHONE_NUMBER;
      }
      return errors;
    },
    onSubmit: (values) => {
      if (checkUsername === false) {
        document.querySelector('[name="username"]')?.scrollIntoView(true);
        alert(FAIL_MESSAGE.CHECK_DUPLICATE_USERNAME);
        return;
      }
      if (checkEmail === false) {
        document.querySelector('[name="email"]')?.scrollIntoView(true);
        alert(FAIL_MESSAGE.REQUIRE_EMAIL_AUTH);
        return;
      }
      axiosInstance
        .post("/users", {
          grade_id: 1,
          username: values.username,
          email: values.email,
          password: values.password,
          phone_number: values.phone_number,
          birth: values.birth,
          gender: +values.gender,
          auth_email: checkEmail,
        })
        .then(({ data }) => {
          if (data.ok && data.code === 201) {
            window.removeEventListener("beforeunload", leaveCurrentPageMessage);
            navigate("/");
          } else {
            alert(FAIL_MESSAGE.CHECK_WRONG_VALUE);
          }
        })
        .catch(() => {
          alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER_CAUSE("회원가입"));
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

  const handleCheckUsernameDuplicated = async () => {
    try {
      const { data } = await axiosInstance.post("/users/check/username", {
        username: formik.values.username,
      });
      if (data.code === 200) {
        setCheckUsername(true);
        setAvailableUsername(true);
      }
    } catch (error: unknown) {
      setCheckUsername(false);
      setAvailableUsername(false);
    }
    setTimeout(() => {
      setAvailableUsername(undefined);
    }, 3 * 1000);
  };
  const handleAuthenticationEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/mailer/confirm?email=${formik.values.email}`
      );
      if (data.code === 200) {
        alert(SUCCESS_MESSAGE.PASS_EMAIL_AUTH);
        setAuthEmailMessage(SUCCESS_MESSAGE.PASS_EMAIL_AUTH);
        setCheckEmail(true);
        setAvailableEmail(true);
      }
    } catch (error: unknown) {
      setCheckEmail(false);
      setAvailableEmail(false);
      const message = (error as CustomAxiosError).response.data.message;
      switch (message) {
        case "already used email":
          alert(FAIL_MESSAGE.ALREADY_USED_EMAIL);
          setAuthEmailMessage(FAIL_MESSAGE.ALREADY_USED_EMAIL);
          break;
        case "token no exists":
          alert(FAIL_MESSAGE.ACCESS_DENIED);
          setAuthEmailMessage(FAIL_MESSAGE.ACCESS_DENIED);
          break;
        case "expired":
          alert(FAIL_MESSAGE.EXPIRED_AUTH_TIME);
          setAuthEmailMessage(FAIL_MESSAGE.EXPIRED_AUTH_TIME);
          break;
        case "invalid token format":
          alert(FAIL_MESSAGE.ACCESS_DENIED);
          setAuthEmailMessage(FAIL_MESSAGE.ACCESS_DENIED);
          break;
        case "already used":
          alert(SUCCESS_MESSAGE.ALREADY_PASS_AUTH);
          setAuthEmailMessage(SUCCESS_MESSAGE.ALREADY_PASS_AUTH);
          setCheckEmail(true);
          setAvailableEmail(true);
          break;
        default:
          alert(FAIL_MESSAGE.FAILED_AUTH);
          setAuthEmailMessage(FAIL_MESSAGE.FAILED_AUTH);
          break;
      }
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setAvailableEmail(undefined);
      setAuthEmailMessage("");
    }, 3 * 1000);
  };

  return (
    <Container
      maxWidth='sm'
      sx={{
        flex: 1,
        my: 5,
      }}>
      {loading && <Loading />}
      <Paper
        sx={{
          py: 5,
          px: 7,
        }}>
        <Stack component='form' gap={1} onSubmit={formik.handleSubmit}>
          <Box>
            <TextField
              focused
              autoFocus
              size='small'
              name='username'
              label='username'
              type='text'
              autoComplete='username'
              fullWidth
              value={formik.values.username}
              onChange={(e) => {
                setCheckUsername(false);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={
                availableUsername === false ||
                (formik.touched.username && Boolean(formik.errors.username))
              }
              helperText={formik.touched.username && formik.errors.username}
              {...(availableUsername !== undefined && {
                FormHelperTextProps: {
                  color: theme.palette.success.main,
                },
                helperText:
                  availableUsername !== undefined &&
                  (availableUsername === true
                    ? "사용가능한 유저네임 입니다."
                    : "중복되는 유저네임 입니다."),
              })}
            />
            <Button
              color='info'
              size='small'
              type='button'
              onClick={handleCheckUsernameDuplicated}>
              중복 확인
            </Button>
          </Box>
          <Box>
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
                setCheckEmail(false);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={
                availableEmail === false ||
                (formik.touched.email && Boolean(formik.errors.email))
              }
              helperText={formik.touched.email && formik.errors.email}
              {...(availableEmail !== undefined && {
                FormHelperTextProps: {
                  color: theme.palette.success.main,
                },
                helperText: availableEmail !== undefined && authEmailMessage,
              })}
            />
            <Button
              id='authentication-btn'
              color='info'
              size='small'
              type='button'
              disabled={checkEmail}
              onClick={() => {
                alert(SUCCESS_MESSAGE.SEND_SIGNUP_AUTH_MAIL_CHECK);
                handleAuthenticationEmail();
              }}>
              본인 인증
            </Button>
          </Box>
          <TextField
            focused
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

          <TextField
            focused
            size='small'
            name='phone_number'
            label='phone_number'
            type='text'
            fullWidth
            placeholder='010-0000-1111'
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phone_number && Boolean(formik.errors.phone_number)
            }
            helperText={
              formik.touched.phone_number && formik.errors.phone_number
            }
          />
          <TextField
            focused
            size='small'
            name='birth'
            label='birth'
            type='date'
            fullWidth
            value={formik.values.birth}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birth && Boolean(formik.errors.birth)}
            helperText={formik.touched.birth && formik.errors.birth}
          />

          <RadioGroup
            name='gender'
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}>
            {options.map((option, i) => (
              <FormControlLabel
                key={option}
                value={i}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>

          {formik.touched.gender && Boolean(formik.errors.gender) && (
            <FormHelperText error>{formik.errors.gender}</FormHelperText>
          )}

          <Button type='submit' color='success' variant='contained'>
            가입하기
          </Button>
          <Button
            type='button'
            color='info'
            variant='contained'
            onClick={() => navigate("/auth/signin")}>
            이미 계정이 있으신가요?
          </Button>
          <Box
            component={Link}
            type='button'
            to={`/auth/request-pass?r=${encodeURIComponent(locate.pathname)}`}
            color='success'
            sx={{
              color: "inherit",
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

export default Signup;
