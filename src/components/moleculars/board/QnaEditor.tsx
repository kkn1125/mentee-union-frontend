import { TokenContext } from "@/context/TokenProvider";
import { ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import Ko from "suneditor/src/lang/ko";
import * as yup from "yup";

type QnaEditorProps = {
  qna?: Board;
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
});

function QnaEditor({ qna }: QnaEditorProps) {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const formik = useFormik({
    initialValues: {
      visible: qna ? qna.visible : true,
      title: qna ? qna.title : "",
      content: qna ? qna.content : "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: object = {};
      return errors;
    },
    onSubmit: (values) => {
      if (!qna) {
        axiosInstance
          .post("/boards/qna", values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data)
          .then((data) => {
            if (data.code === 201) {
              if (confirm("글 작성에 성공했습니다. 자세히 보시겠습니까?")) {
                navigate("/boards/qna/" + data.data.id);
              } else {
                navigate("/boards/qna");
              }
            }
          })
          .catch((error) => {
            console.log(error);
            alert("글 작성에 실패했습니다.");
          });
      } else {
        axiosInstance
          .put("/boards/qna" + qna.id, values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data.data)
          .then((data) => {
            console.log(data);
            if (data.message.match(/success/)) {
              alert("글 수정에 성공했습니다.");
              navigate("/boards/qna/" + qna.id);
            }
          })
          .catch((error) => {
            console.log(error);
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
          QNA
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
          <SunEditor
            // getSunEditorInstance={getSunEditorInstance}
            lang={Ko}
            name='content'
            height={"300px"}
            {...(qna && { defaultValue: formik.values.content })}
            onChange={(value) => {
              formik.setFieldValue("content", value, true);
            }}
          />
        </Box>
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

export default QnaEditor;
