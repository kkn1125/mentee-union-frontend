import CtmSunEditor from "@/components/atoms/common/CtmSunEditor";
import { TokenContext } from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Ko from "suneditor/src/lang/ko";
import * as yup from "yup";

type NoticeEditorProps = {
  notice?: Board;
};

const validationSchema = yup.object({
  visible: yup
    .boolean()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_BOOLEAN),
  title: yup
    .string()
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  content: yup
    .string()
    .min(1, ERROR_MESSAGE.PASSWORD.MIN(1))
    .required(ERROR_MESSAGE.REQUIRED)
    .typeError(ERROR_MESSAGE.ONLY_STRING),
  sequence: yup.number().typeError(ERROR_MESSAGE.ONLY_NUMBER),
});

const logger = new Logger(NoticeEditor.name);

function NoticeEditor({ notice }: NoticeEditorProps) {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const formik = useFormik({
    initialValues: {
      visible: notice ? notice.visible : true,
      title: notice ? notice.title : "",
      content: notice ? notice.content : "",
      sequence: notice ? notice.sequence : -1,
    },
    validationSchema: validationSchema,
    validate(_values) {
      const errors: object = {};
      return errors;
    },
    onSubmit: (values) => {
      if (!notice) {
        axiosInstance
          .post("/boards/notice", values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data)
          .then((data) => {
            if (data.code === 201) {
              if (confirm("글 작성에 성공했습니다. 자세히 보시겠습니까?")) {
                navigate("/boards/notice/" + data.data.id);
              } else {
                navigate("/boards/notice");
              }
            }
          })
          .catch((error) => {
            logger.log(error);
            alert("글 작성에 실패했습니다.");
          });
      } else {
        axiosInstance
          .put("/boards/notice/" + notice.id, values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data.data)
          .then((data) => {
            if (data.message.match(/success/)) {
              alert("글 수정에 성공했습니다.");
              navigate("/boards/notice/" + notice.id);
            }
          })
          .catch((error) => {
            logger.log(error);
            alert("글 수정에 실패했습니다.");
          });
      }
    },
  });

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  return (
    <Box component='form' onSubmit={formik.handleSubmit}>
      <Stack
        component={Paper}
        gap={2}
        sx={{
          p: 3,
        }}>
        <Typography variant='h6' textTransform={"uppercase"}>
          Notice
        </Typography>
        <TextField
          name='title'
          fullWidth
          variant='standard'
          label='제목'
          value={formik.values.title}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <Box
          sx={{
            flex: 1,
            ".se-wrapper, .se-wrapper-inner": {
              height: "300px",
            },
          }}>
          <CtmSunEditor
            lang={Ko}
            name='content'
            height={"300px"}
            {...(notice && { defaultValue: formik.values.content })}
            onChange={(value) => {
              formik.setFieldValue("content", value, true);
            }}
          />
        </Box>
        <TextField
          name='sequence'
          fullWidth
          type='number'
          variant='standard'
          label='우선순위'
          value={formik.values.sequence}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        <FormControlLabel
          label='공개 여부'
          control={<Switch name='visible' checked={formik.values.visible} />}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
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

export default NoticeEditor;
