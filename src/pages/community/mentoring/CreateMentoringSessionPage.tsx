import { ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import MenuIcon from "@mui/icons-material/Menu";
import PowerIcon from "@mui/icons-material/Power";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import * as yup from "yup";

const validationSchema = yup.object({
  topic: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  objective: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  category: yup
    .number()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  format: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  note: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  limit: yup
    .number()
    .min(2, ERROR_MESSAGE.MIN(2))
    .max(20, ERROR_MESSAGE.MAX(20))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_NUMBER),
});

type CreateMentoringSessionPageProps = {
  isConnected: boolean;
  handleDrawerToggle: () => void;
  socket: Socket;
};

function CreateMentoringSessionPage({
  isConnected,
  handleDrawerToggle,
  socket,
}: CreateMentoringSessionPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const formik = useFormik({
    initialValues: {
      topic: "",
      category: 1,
      objective: "",
      format: "",
      note: "",
      limit: 2,
    },
    validationSchema: validationSchema,
    validate(values) {
      // console.log(values);
      const errors: { email?: string } = {};
      // console.log(errors, values);
      return errors;
    },
    onSubmit: async (values) => {
      const { category, ...rest } = values;
      try {
        const copy = {
          ...rest,
          category_id: category,
        };
        socket.emit("createSession", copy);
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  useEffect(() => {
    axiosInstance.get("/categories").then((res) => {
      const { data } = res.data;
      console.log(data);
      setCategories(data);
    });
  }, []);

  return (
    <Stack flex={1} sx={{ height: "inherit" }}>
      <Stack
        direction='row'
        alignItems='center'
        gap={1}
        sx={{ p: 2, minHeight: 66 }}>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}>
          <MenuIcon />
        </IconButton>
        <Typography>멘토링 안내</Typography>
        <Tooltip title={isConnected ? "connected" : "disconnected"}>
          <Badge variant='dot' color={isConnected ? "success" : "error"}>
            <PowerIcon />
          </Badge>
        </Tooltip>
      </Stack>
      <Divider sx={{ borderColor: "#565656" }} />
      <Stack
        flex={1}
        gap={2}
        sx={{
          p: 2,
          overflow: "auto",
        }}>
        <Container>
          <Stack
            direction={{ xs: "column-reverse", md: "row" }}
            gap={2}
            sx={{ height: "inherit" }}>
            <Stack flex={1}>
              <Typography
                fontSize={(theme) => theme.typography.pxToRem(18)}
                fontWeight={700}
                gutterBottom>
                멘토링 서비스
              </Typography>
              <Typography variant='body1'>
                원활한 멘토링을 위해 아래 사항을 준수 해주세요.
              </Typography>
              <Typography variant='body2'>
                1. 멘토링의 목적은 상호간 정보를 공유하고, 격려하며, 서로
                성장하는 것 입니다. 부적절한 목적은 제한 대상이 됩니다.
              </Typography>
              <Typography variant='body2'>
                2. 관심 분야를 정하고 "매칭하기"를 누르면 동일한 분야를 원하는
                멘티와 대화방이 생성됩니다.
              </Typography>
              <Typography variant='body2'>
                3. 직접 멘토링에 참여하려면 좌측 생성된 멘토링 세션을 클릭하고
                대화방 인원의 동의를 얻으면 참가 가능합니다.
              </Typography>
            </Stack>
            <Stack
              flex={0.5}
              component={"form"}
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ width: "70%", mx: "auto" }}>
              <Paper
                component={Stack}
                gap={3}
                sx={{
                  p: 3,
                }}>
                <TextField
                  name='topic'
                  label='멘토링 제목'
                  size='small'
                  fullWidth
                  value={formik.values.topic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.topic && Boolean(formik.errors.topic)}
                  helperText={formik.touched.topic && formik.errors.topic}
                  FormHelperTextProps={{
                    sx: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    },
                  }}
                />
                <TextField
                  name='objective'
                  label='목표'
                  size='small'
                  fullWidth
                  value={formik.values.objective}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.objective && Boolean(formik.errors.objective)
                  }
                  helperText={
                    formik.touched.objective && formik.errors.objective
                  }
                  FormHelperTextProps={{
                    sx: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    },
                  }}
                />
                <Box>
                  <Select
                    name='category'
                    size='small'
                    fullWidth
                    value={
                      categories.length > 0 ? formik.values.category || 1 : ""
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }>
                    <MenuItem value={""} sx={{ display: "none" }}>
                      <em></em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.description}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.category &&
                    Boolean(formik.errors.category) && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        {formik.errors.category}
                      </FormHelperText>
                    )}
                </Box>
                {/* <TextField label='분야' size='small' fullWidth /> */}
                <TextField
                  name='format'
                  label='멘토링 형식'
                  size='small'
                  fullWidth
                  inputProps={{
                    min: 2,
                    max: 20,
                  }}
                  value={formik.values.format}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.format && Boolean(formik.errors.format)}
                  helperText={formik.touched.format && formik.errors.format}
                  FormHelperTextProps={{
                    sx: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    },
                  }}
                />
                <TextField
                  name='note'
                  label='메모'
                  size='small'
                  fullWidth
                  inputProps={{
                    min: 2,
                    max: 20,
                  }}
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.note && Boolean(formik.errors.note)}
                  helperText={formik.touched.note && formik.errors.note}
                  FormHelperTextProps={{
                    sx: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    },
                  }}
                />
                <TextField
                  name='limit'
                  label='제한 인원'
                  type='number'
                  size='small'
                  fullWidth
                  inputProps={{
                    min: 2,
                    max: 20,
                  }}
                  value={formik.values.limit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.limit && Boolean(formik.errors.limit)}
                  helperText={formik.touched.limit && formik.errors.limit}
                  FormHelperTextProps={{
                    sx: {
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    },
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button variant='contained' type='submit'>
                    생성
                  </Button>
                </Box>
              </Paper>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Stack>
  );
}

export default CreateMentoringSessionPage;
