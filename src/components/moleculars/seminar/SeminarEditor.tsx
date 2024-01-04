import VisuallyHiddenInput from "@/components/atoms/common/VisuallyHiddenInput";
import DateField from "@/components/atoms/seminar/DateField";
import { TokenContext } from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { API_PATH, ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { checkImageSize } from "@/util/tool";
import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import Ko from "suneditor/src/lang/ko";
import * as yup from "yup";
import Placeholder from "../common/Placeholder";

type SeminarEditorProps = {
  seminar?: Seminar;
};

const validationSchema = yup.object({
  category: yup
    .number()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_NUMBER),
  title: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  content: yup
    .string()
    .min(10, ERROR_MESSAGE.MIN(10))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  limit_participant_amount: yup
    .number()
    .min(2, ERROR_MESSAGE.NUMBER.MIN(2))
    .max(50, ERROR_MESSAGE.NUMBER.MAX(50))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  meeting_place: yup
    .string()
    .min(1, ERROR_MESSAGE.MIN(1))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  recruit_start_date: yup
    .date()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_DATE),
  recruit_end_date: yup
    .date()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_DATE),
  seminar_start_date: yup
    .date()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_DATE),
  seminar_end_date: yup
    .date()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_DATE),
});

interface CurrentTimeWithProps {
  now: Date;
  year: number;
  month: number;
  date: number;
}

interface CurrentTime {
  now: Date;
}

const logger = new Logger(SeminarEditor.name);

function SeminarEditor({ seminar }: SeminarEditorProps) {
  const [cover, setCover] = useState<{ file: File | null; error: string }>({
    file: null,
    error: "",
  });
  const [coverPreview, setCoverPreview] = useState(
    seminar && seminar.cover
      ? API_PATH + "/seminars/cover/" + seminar.cover.new_name
      : ""
  );
  const [currentTime /* setCurrentTime */] = useState<
    CurrentTime & CurrentTimeWithProps
  >({
    now: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    date: new Date().getDate(),
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const formik = useFormik({
    initialValues: {
      category: seminar ? seminar.category_id : 1,
      title: seminar ? seminar.title : "",
      content: seminar ? seminar.content : "",
      limit_participant_amount: seminar ? seminar.limit_participant_amount : 2,
      meeting_place: seminar ? seminar.meeting_place : "",
      recruit_start_date: seminar
        ? seminar.recruit_start_date
        : new Date(currentTime.year, currentTime.month, currentTime.date + 1),
      recruit_end_date: seminar
        ? seminar.recruit_end_date
        : new Date(currentTime.year, currentTime.month, currentTime.date + 1),
      seminar_start_date: seminar
        ? seminar.seminar_start_date
        : new Date(currentTime.year, currentTime.month, currentTime.date + 1),
      seminar_end_date: seminar
        ? seminar.seminar_end_date
        : new Date(currentTime.year, currentTime.month, currentTime.date + 1),
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: {
        category?: string;
        title?: string;
        content?: string;
        limit_participant_amount?: string;
        meeting_place?: string;
        recruit_start_date?: string;
        recruit_end_date?: string;
        seminar_start_date?: string;
        seminar_end_date?: string;
        cover?: string;
      } = {};

      const startDayMoreThanTomorrow = new Date(
        currentTime.year,
        currentTime.month,
        currentTime.date
      );
      startDayMoreThanTomorrow.setDate(startDayMoreThanTomorrow.getDate() + 1);

      if (!seminar) {
        if (values.recruit_start_date < startDayMoreThanTomorrow) {
          errors.recruit_start_date =
            "모집 시작은 최소 하루 이후 시간으로 설정 가능합니다.";
        }

        if (errors.recruit_start_date) {
          errors.recruit_end_date = "모집 시작 시간 조건을 충족해주세요.";
        } else if (values.recruit_end_date < values.recruit_start_date) {
          errors.recruit_end_date =
            "모집 종료가 모집 시작시간보다 과거일 수 없습니다.";
        }
      }

      const seminarMoreThanRecruitOneDay = new Date(values.recruit_end_date);

      seminarMoreThanRecruitOneDay.setDate(
        seminarMoreThanRecruitOneDay.getDate() + 1
      );

      if (values.seminar_start_date < values.recruit_end_date) {
        errors.seminar_start_date =
          "세미나 시작이 모집 종료시간보다 과거일 수 없습니다.";
      } else if (values.seminar_start_date < seminarMoreThanRecruitOneDay) {
        errors.seminar_start_date =
          "세미나 시작은 모집 종료시간과 하루 이상 차이가 있어야합니다.";
      } else if (
        !errors.seminar_start_date &&
        (errors.recruit_start_date || errors.recruit_end_date)
      ) {
        errors.seminar_start_date = "모집 기간 조건을 충족해야합니다.";
      }

      if (errors.seminar_start_date) {
        errors.seminar_end_date = "세미나 시작 시간 조건을 충족해주세요.";
      } else if (values.seminar_end_date < values.seminar_start_date) {
        errors.seminar_end_date =
          "세미나 종료가 세미나 시작시간보다 과거일 수 없습니다.";
      } else if (
        !errors.seminar_end_date &&
        (errors.recruit_start_date || errors.recruit_end_date)
      ) {
        errors.seminar_end_date = "모집 기간 조건을 충족해야합니다.";
      }

      if (checkImageSize(cover.file, 10)) {
        errors.cover = "커버 이미지 사이즈는 10kb 이하여야 합니다.";
      }
      return errors;
    },
    onSubmit: (values) => {
      const { category, ...rest } = values;
      const convertValues = {
        ...rest,
        category_id: category,
        cover: cover.file,
      };
      logger.log(convertValues);

      if (!seminar) {
        axiosInstance
          .post("/seminars", convertValues, {
            headers: {
              Authorization: "Bearer " + token.token,
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => data)
          .then((data) => {
            if (data.code === 201) {
              if (confirm("글 작성에 성공했습니다. 자세히 보시겠습니까?")) {
                navigate("/community/seminars/" + data.data.id);
              } else {
                navigate("/community/seminars");
              }
            }
          })
          .catch((error) => {
            logger.log(error);
            alert("글 작성에 실패했습니다.");
          });
      } else {
        axiosInstance
          .put("/seminars/" + seminar.id, convertValues, {
            headers: {
              Authorization: "Bearer " + token.token,
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => data)
          .then((data) => {
            logger.log(data);
            if (data.code === 200 && data.message.match(/success/)) {
              alert("글 수정에 성공했습니다.");
              navigate("/community/seminars/" + seminar.id);
            }
          })
          .catch((error) => {
            logger.log(error);
            alert("글 수정에 실패했습니다.");
          });
      }
    },
  });

  useEffect(() => {
    axiosInstance.get("/categories").then((res) => {
      const { data } = res.data;
      setCategories(data);
    });
  }, []);

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    handleResetFile();
    const file = e.target.files?.item(0);
    if (file) {
      const isOver = checkImageSize(file, 10);

      setCover((cover) => ({
        ...cover,
        file,
        error: isOver ? "커버 이미지 사이즈는 10kb 이하여야 합니다." : "",
      }));

      setCoverPreview(URL.createObjectURL(file));
    }
  }

  function handleResetFile() {
    const upload = document.getElementById("cover-image") as HTMLInputElement;
    upload.files = null;
    setCoverPreview("");
    setCover((cover) => ({ ...cover, file: null, error: "" }));
  }

  return (
    <Box component='form' onSubmit={formik.handleSubmit}>
      <Paper sx={{ p: 3, mb: 5 }}>
        <Typography variant='h5'>커버 이미지</Typography>
        <Stack alignItems={"center"}>
          <VisuallyHiddenInput
            accept='image/*'
            name='coverField'
            id='cover-image'
            type='file'
            onChange={(e) => {
              const file = e.target.files?.item(0);
              if (file && file !== cover.file) {
                handleUploadFile(e);
                formik.handleChange(e);
              }
            }}
            onBlur={formik.handleBlur}
          />
          <Stack
            sx={{
              p: 3,
              position: "relative",
              color: (theme) => theme.palette.background.default,
              backgroundColor: "background.default",
            }}>
            <Placeholder width={300} height={300} src={coverPreview} />
            <Button
              color='inherit'
              component={"label"}
              htmlFor='cover-image'
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
              upload
            </Button>
          </Stack>
          {cover.file && (
            <Typography>{(cover.file.size / 1024).toFixed(2)}Kb</Typography>
          )}
          {Boolean(cover.error) && (
            <FormHelperText error={Boolean(cover.error)}>
              {cover.error}
            </FormHelperText>
          )}
          <Stack
            direction='row'
            gap={3}
            sx={{
              my: 3,
            }}>
            <Button color='info' variant='contained' onClick={handleResetFile}>
              커버 제거
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack
        component={Paper}
        gap={2}
        sx={{
          p: 3,
        }}>
        <Typography variant='h6' textTransform={"uppercase"}>
          seminar
        </Typography>
        <TextField
          variant='standard'
          size='small'
          name='title'
          fullWidth
          label='제목'
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
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
        <Box>
          <Select
            name='category'
            size='small'
            fullWidth
            value={categories.length > 0 ? formik.values.category || 1 : ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.category && Boolean(formik.errors.category)}>
            <MenuItem value={""} sx={{ display: "none" }}>
              <em></em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.description}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.category && Boolean(formik.errors.category) && (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.category}
            </FormHelperText>
          )}
        </Box>
        <TextField
          name='meeting_place'
          size='small'
          fullWidth
          label='미팅 장소'
          value={formik.values.meeting_place}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.meeting_place && Boolean(formik.errors.meeting_place)
          }
          helperText={
            formik.touched.meeting_place && formik.errors.meeting_place
          }
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
          name='limit_participant_amount'
          size='small'
          type='number'
          fullWidth
          label='최대 참여 인원'
          value={formik.values.limit_participant_amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.limit_participant_amount &&
            Boolean(formik.errors.limit_participant_amount)
          }
          helperText={
            formik.touched.limit_participant_amount &&
            formik.errors.limit_participant_amount
          }
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
          inputProps={{
            min: 2,
            max: 50,
          }}
        />

        {/* durations */}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          gap={2}
          sx={{
            mb: 5,
          }}>
          <Stack direction='row' alignItems='center' gap={2}>
            <DateField
              label='모집 시작'
              name='recruit_start_date'
              value={formik.values.recruit_start_date}
              onChange={(date) => {
                formik.setFieldValue("recruit_start_date", date);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.recruit_start_date &&
                Boolean(formik.errors.recruit_start_date)
              }
              helperText={
                (formik.touched.recruit_start_date &&
                  formik.errors.recruit_start_date) as ReactNode
              }
              sx={{
                position: "relative",
              }}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                  left: 0,
                },
              }}
            />
            ~
            <DateField
              label='모집 종료'
              name='recruit_end_date'
              value={formik.values.recruit_end_date}
              onChange={(date) => {
                formik.setFieldValue("recruit_end_date", date);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.recruit_end_date &&
                Boolean(formik.errors.recruit_end_date)
              }
              helperText={
                (formik.touched.recruit_end_date &&
                  formik.errors.recruit_end_date) as ReactNode
              }
              sx={{
                position: "relative",
              }}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                  left: 0,
                },
              }}
            />
          </Stack>
          <Stack direction='row' alignItems='center' gap={2}>
            <DateField
              label='세미나 시작'
              name='seminar_start_date'
              value={formik.values.seminar_start_date}
              onChange={(date) => {
                formik.setFieldValue("seminar_start_date", date);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seminar_start_date &&
                Boolean(formik.errors.seminar_start_date)
              }
              helperText={
                (formik.touched.seminar_start_date &&
                  formik.errors.seminar_start_date) as ReactNode
              }
              sx={{
                position: "relative",
              }}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                  left: 0,
                },
              }}
            />
            ~
            <DateField
              label='세미나 종료'
              name='seminar_end_date'
              value={formik.values.seminar_end_date}
              onChange={(date) => {
                formik.setFieldValue("seminar_end_date", date);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.seminar_end_date &&
                Boolean(formik.errors.seminar_end_date)
              }
              helperText={
                (formik.touched.seminar_end_date &&
                  formik.errors.seminar_end_date) as ReactNode
              }
              sx={{
                position: "relative",
              }}
              FormHelperTextProps={{
                sx: {
                  position: "absolute",
                  top: "100%",
                  left: 0,
                },
              }}
            />
          </Stack>
        </Stack>

        {/* editor */}
        <Box
          sx={{
            flex: 1,
            ".se-wrapper, .se-wrapper-inner": {
              height: "300px",
            },
          }}>
          <SunEditor
            lang={Ko}
            name='content'
            height={"300px"}
            {...(seminar && { defaultValue: formik.values.content })}
            onChange={(value) => {
              formik.setFieldValue("content", value, true);
            }}
          />
          {formik.touched.content && Boolean(formik.errors.content) && (
            <FormHelperText sx={{ color: "error.main" }}>
              {formik.errors.content}
            </FormHelperText>
          )}
        </Box>
        <Stack direction='row' justifyContent='space-between' gap={1}>
          <Button variant='contained' color='success' type='submit'>
            작성
          </Button>
          <Button
            variant='contained'
            color='inherit'
            type='button'
            onClick={() => handleRedirect(-1)}>
            취소
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SeminarEditor;
