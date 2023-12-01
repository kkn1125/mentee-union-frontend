import Loading from "@/components/atoms/Loading";
import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
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
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(1, "최소 1자 이상 입력해야합니다.")
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
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
  phone_number: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  birth: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  gender: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
});

const options = ["male", "female", "none"];

function Signup() {
  const tokenDispatch = useContext(TokenDispatchContext);
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
      const userMatched = values.username.match(
        /\b(?![\s_\-0-9])(?=.*[A-Za-z])(?=.*([0-9_-]?|[^\s]))[A-Za-z0-9_-]+/g
      );
      const emailMatched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
      );
      const passwordMatched = values.password.match(
        /(?=.*[A-Z])(?=.*[a-z])[A-Za-z]{1,}(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{0,}(?=.*[0-9])(?=.*[!@#$%^&*()])[A-Za-z0-9!@#$%^&*()]{4,20}/g
      );
      const phoneNumberMatched = values.phone_number.match(
        /\d{2,3}-\d{3,4}-\d{4}/g
      );

      /* match confirm */
      if (values.username.length < 5 || values.username.length > 20) {
        errors.username =
          "유저네임은 영문자로 시작하는 5~20자의 영문, 숫자, 밑줄(_), 대시(-)로 구성해야 합니다.";
      }
      if (!userMatched || userMatched[0] !== values.username) {
        if (userMatched) {
          if (userMatched[0] !== values.username) {
            errors.username = "숫자나 특수 문자로 시작할 수 없습니다.";
          } else {
            errors.username =
              "유저네임은 영문자로 시작하는 5~20자의 영문, 숫자, 밑줄(_), 대시(-)로 구성해야 합니다. 숫자나 특수 문자로 시작할 수 없습니다.";
          }
        } else {
          errors.username =
            "유저네임은 영문자로 시작하는 5~20자의 영문, 숫자, 밑줄(_), 대시(-)로 구성해야 합니다. 숫자나 특수 문자로 시작할 수 없습니다.";
        }
      }
      if (!emailMatched || emailMatched[0] !== values.email) {
        errors.email = "이메일 형식이 아닙니다.";
      }
      if (!passwordMatched || passwordMatched[0] !== values.password) {
        errors.password =
          "비밀번호는 숫자, 영문 대소문자, 특수문자가 최소 1개 씩 포함되어야 하며, 5 ~ 20자 이내로 작성해야 합니다.";
      }
      if (
        !phoneNumberMatched ||
        phoneNumberMatched[0] !== values.phone_number
      ) {
        errors.phone_number =
          "폰 번호 형식이 아닙니다. 010-0000-1111 로 작성해야 합니다.";
      }
      return errors;
    },
    onSubmit: (values) => {
      if (checkUsername === false) {
        document.querySelector('[name="username"]')?.scrollIntoView(true);
        alert("유저네임 중복확인은 필수 입니다.");
        return;
      }
      if (checkEmail === false) {
        document.querySelector('[name="email"]')?.scrollIntoView(true);
        alert("이메일 본인인증은 필수 입니다.");
        return;
      }
      // alert(JSON.stringify(values, null, 2));
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
          // const { access_token, refresh_token } = data;
          // tokenDispatch({
          //   type: TOKEN_ACTION.SAVE,
          //   token: access_token,
          //   refresh: refresh_token,
          // });
          // console.log(data);
          // console.log(data.ok, data.code === 201);
          if (data.ok && data.code === 201) {
            window.removeEventListener("beforeunload", leaveCurrentPageMessage);
            navigate("/");
          } else {
            alert("입력 값 중 잘못된 값이 있습니다. 확인해주세요.");
            // formik.resetForm();
          }
        })
        .catch(() => {
          alert("회원가입에 문제가 발생했습니다.");
          // formik.resetForm();
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
        alert("본인인증이 완료 되었습니다.");
        setAuthEmailMessage("본인인증이 완료 되었습니다.");
        setCheckEmail(true);
        setAvailableEmail(true);
      }
    } catch (error: unknown) {
      setCheckEmail(false);
      setAvailableEmail(false);
      const message = (error as CustomAxiosError).response.data.message;
      switch (message) {
        case "already used email":
          alert("이미 사용 중인 이메일 입니다.");
          setAuthEmailMessage("이미 사용 중인 이메일 입니다.");
          break;
        case "token no exists":
          alert("유효하지 않은 접근입니다.");
          setAuthEmailMessage("유효하지 않은 접근입니다.");
          break;
        case "expired":
          alert("인증 시간이 만료 되었습니다.");
          setAuthEmailMessage("인증 시간이 만료 되었습니다.");
          break;
        case "invalid token format":
          alert("유효하지 않은 접근입니다.");
          setAuthEmailMessage("유효하지 않은 접근입니다.");
          break;
        case "already used":
          alert("이미 인증이 완료 되었습니다.");
          setAuthEmailMessage("이미 인증이 완료 되었습니다.");
          setCheckEmail(true);
          setAvailableEmail(true);
          break;
        default:
          alert("본인인증에 실패 했습니다.");
          setAuthEmailMessage("본인인증에 실패 했습니다.");
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
                alert(
                  "해당 이메일로 본인인증 메일이 발송되었습니다. 본인 인증 유효 시간은 1분 입니다. 메일을 확인 후 작업을 완료해주세요."
                );
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
