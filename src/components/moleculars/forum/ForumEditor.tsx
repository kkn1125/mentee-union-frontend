import { TokenContext } from "@/context/TokenProvider";
import { ERROR_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { default as SunEditorType } from "suneditor/src/lib/core";
import * as yup from "yup";
import Ko from "suneditor/src/lang/ko";

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

function ForumEditor({ forum }: ForumEditorProps) {
  // const editor = useRef<SunEditorType | null>(null);
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const formik = useFormik({
    initialValues: {
      title: forum ? forum.title : "",
      content: forum ? forum.content : "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: object = {};
      // console.log(values);
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
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
            console.log(error);
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
            console.log(data);
            if (data.message.match(/success/)) {
              alert("글 수정에 성공했습니다.");
              navigate("/community/forums/" + forum.id);
            }
          })
          .catch((error) => {
            console.log(error);
            alert("글 수정에 실패했습니다.");
          });
      }
    },
  });

  useEffect(() => {
    // if (editor.current) {
    //   editor.current.onload = (e) => {
    //     console.log("loaded", e.getSelectionNode());
    //   };
    // }
  }, []);

  // const getSunEditorInstance = (sunEditor: SunEditorType) => {
  //   Object.assign(editor, { current: sunEditor });
  // };

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
          <SunEditor
            // getSunEditorInstance={getSunEditorInstance}
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
