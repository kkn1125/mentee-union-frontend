import CtmSunEditor from "@/components/atoms/common/CtmSunEditor";
import { TokenContext } from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css";
import Ko from "suneditor/src/lang/ko";
import * as yup from "yup";

type ForumEditorProps = {
  forum?: Forum;
};

const validationSchema = yup.object({
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

const logger = new Logger(ForumEditor.name);

function ForumEditor({ forum }: ForumEditorProps) {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const formik = useFormik({
    initialValues: {
      title: forum ? forum.title : "",
      content: forum ? forum.content : "",
    },
    validationSchema: validationSchema,
    validate(_values) {
      const errors: object = {};
      return errors;
    },
    onSubmit: (values) => {
      logger.log(values);
      if (!forum) {
        axiosInstance
          .post("/forums", values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data.data)
          .then((data) => {
            if (data.message.match(/success/)) {
              if (confirm("글 작성에 성공했습니다. 자세히 보시겠습니까?")) {
                navigate("/community/forums/" + data.details[0].id);
              } else {
                navigate("/community/forums");
              }
            }
          })
          .catch((error) => {
            logger.log(error);
            alert("글 작성에 실패했습니다.");
          });
      } else {
        axiosInstance
          .put("/forums/" + forum.id, values, {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => data.data)
          .then((data) => {
            logger.log(data);
            if (data.message.match(/success/)) {
              alert("글 수정에 성공했습니다.");
              navigate("/community/forums/" + forum.id);
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
          article
        </Typography>
        <TextField
          name='title'
          fullWidth
          variant='standard'
          label='title'
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
            {...(forum && { defaultValue: formik.values.content })}
            onChange={(value) => {
              formik.setFieldValue("content", value, true);
            }}
          />
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

export default ForumEditor;
