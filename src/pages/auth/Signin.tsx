import { TOKEN_ACTION, TokenDispatchContext } from "@/context/TokenProvider";
import { axiosInstance } from "@/util/instances";
import { Box, Button, Container, Paper, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
});

function Signin() {
  const tokenDispatch = useContext(TokenDispatchContext);
  const navigate = useNavigate();

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
        });
    },
  });

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}>
      <Paper
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
          <Button type='submit'>sign in</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Signin;
