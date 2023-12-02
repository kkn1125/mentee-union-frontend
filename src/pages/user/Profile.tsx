import GuageBar from "@/components/atoms/GaugeBar";
import Loading from "@/components/atoms/Loading";
import Placeholder from "@/components/moleculars/Placeholder";
import { TokenContext } from "@/context/TokenProvider";
import { axiosInstance } from "@/util/instances";
import { convertDateStringPropertyToDate, timeFormat } from "@/util/tool";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import * as yup from "yup";

type UpdateData = {
  birth?: string | undefined;
  email?: string | undefined;
  phone_number?: string | undefined;
  username?: string | undefined;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
  phone_number: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
  birth: yup
    .string()
    .required("필수 항목입니다.")
    .typeError("문자만 입력 가능합니다."),
});

function Profile() {
  const token = useContext(TokenContext);
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [profilePreview, setProfilePreview] = useState("");
  const [profile, setProfile] = useState<{ file: File | null; error: string }>({
    file: null,
    error: "",
  });

  const formik = useFormik<{
    username: string;
    email: string;
    birth: string;
    phone_number: string;
  }>({
    initialValues: {
      username: "",
      email: "",
      birth: "",
      phone_number: "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: {
        username?: string;
        email?: string;
        birth?: string;
        phone_number?: string;
      } = {};
      /* property match condition */
      const userMatched = values.username.match(
        /\b(?![\s_\-0-9])(?=.*[A-Za-z])(?=.*([0-9_-]?|[^\s]))[A-Za-z0-9_-]+/g
      );
      const emailMatched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
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
      console.log(values);

      const updated: UpdateData = {};

      timeFormat(values.birth as string, "YYYY-MM-dd") !==
        timeFormat(profileData.birth as Date, "YYYY-MM-dd") &&
        (updated.birth = values.birth);
      values.email !== profileData.email && (updated.email = values.email);
      values.phone_number !== profileData.phone_number &&
        (updated.phone_number = values.phone_number);
      values.username !== profileData.username &&
        (updated.username = values.username);

      handleSubmitProfile(updated);

      // alert("test");
    },
  });

  useEffect(() => {
    if (token.token) {
      initProfileData();
    }
  }, [token]);

  function initProfileData() {
    axiosInstance
      .get(`/users/profile`, {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }: { data: { data: User } }) => {
        setLoading(false);
        const originData = data.data;
        const convertedProfileData = convertDateStringPropertyToDate(
          originData
        ) as User;
        setProfileData(convertedProfileData);
        if (data.data.profiles[0]) {
          setProfilePreview(
            "http://localhost:8080/api/users/profile/" +
              data.data.profiles[0].new_name
          );
        }
        formik.setValues({
          username: convertedProfileData.username,
          email: convertedProfileData.email,
          birth: originData.birth as unknown as string,
          phone_number: convertedProfileData.phone_number,
        });
      });
  }

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    handleResetFile();
    const file = e.target.files?.item(0);
    if (file) {
      const isOver = checkImageSize(file, 10);

      setProfile((profile) => ({
        ...profile,
        file,
        error: isOver ? "프로필 이미지 사이즈는 10kb 이하여야 합니다." : "",
      }));
      setProfilePreview(URL.createObjectURL(file));
    }
  }

  function handleResetFile() {
    const upload = document.getElementById("profile-image") as HTMLInputElement;
    upload.files = null;
    setProfilePreview("");
  }

  function checkImageSize(file: File | null, limit: number = 10) {
    if (file) {
      return parseFloat((file.size / 1024).toFixed(2)) > limit;
    } else {
      return false;
    }
  }

  function handleSubmitProfile(updatedData: UpdateData) {
    axiosInstance
      .put(`/users/${profileData.id}`, updatedData)
      .then(({ data }) => {
        if (data.ok) {
          setProfile((profile) => ({ ...profile, file: null, error: "" }));
          initProfileData();
        }
      });
  }

  function handleUpdateUserInfo() {
    if (checkImageSize(profile.file, 10)) {
      setProfile((profile) => ({
        ...profile,
        error: "이미지 사이즈를 맞춰주세요. ",
      }));
    } else {
      console.log(profile.file);
      axiosInstance
        .put(
          "/users/profile",
          {
            profile: profile.file,
          },
          {
            headers: {
              Authorization: "Bearer " + token.token,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(({ data }) => {
          if (data.ok) {
            setProfile((profile) => ({ ...profile, file: null, error: "" }));
            initProfileData();
          }
        });
    }
  }

  function handleRemoveProfile() {
    axiosInstance
      .delete("/users/profile", {
        headers: {
          Authorization: "Bearer " + token.token,
        },
      })
      .then(({ data }) => {
        if (data.ok) {
          setProfile((profile) => ({ ...profile, file: null, error: "" }));
          initProfileData();
          handleResetFile();
        }
      });
  }

  return loading ? (
    <Loading />
  ) : (
    <Stack gap={3} sx={{ width: "60%", margin: "auto", pt: 5 }}>
      <Stack flex={1} gap={1} alignItems='center'>
        <Typography variant='h3' fontWeight={700}>
          프로필
        </Typography>
        <Typography variant='body1'>
          프로필을 완성하고 멘티들에게 자신을 알리세요!
        </Typography>
      </Stack>

      <Stack alignItems={"center"}>
        <VisuallyHiddenInput
          accept='image/*'
          name='profileField'
          id='profile-image'
          type='file'
          onChange={(e) => {
            const file = e.target.files?.item(0);
            if (file && file !== profile.file) {
              handleUploadFile(e);
              formik.handleChange(e);
            }
          }}
          onBlur={formik.handleBlur}
        />
        <Stack
          sx={{
            position: "relative",
            color: (theme) => theme.palette.background.default,
          }}>
          <Placeholder width={300} height={300} src={profilePreview} />
          <Button
            color='inherit'
            component={"label"}
            htmlFor='profile-image'
            // onClick={handleUpdateUserInfo}
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
        {profile.file && (
          <Typography>{(profile.file.size / 1024).toFixed(2)}Kb</Typography>
        )}
        {Boolean(profile.error) && (
          <FormHelperText error={Boolean(profile.error)}>
            {profile.error}
          </FormHelperText>
        )}
        <Stack
          direction='row'
          gap={3}
          sx={{
            my: 3,
          }}>
          <Button
            color='info'
            variant='contained'
            onClick={handleRemoveProfile}>
            프로필 원본 제거
          </Button>
          <Button
            variant='contained'
            color='info'
            onClick={handleUpdateUserInfo}>
            프로필 변경
          </Button>
          <Button color='info' variant='contained' onClick={handleResetFile}>
            프로필 제거
          </Button>
        </Stack>
      </Stack>

      <Stack
        flex={1}
        gap={1}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}>
        <Typography variant='h5' fontWeight={700} gutterBottom>
          나의 멘티 정보
        </Typography>
        <Stack direction='row' alignItems={"center"} gap={1}>
          <Typography fontWeight={700} variant='body2' sx={{ flex: 0.1 }}>
            Level
          </Typography>
          <Typography
            variant='body2'
            sx={{
              flex: 0.1,
              fontSize: (theme) => theme.typography.pxToRem(12),
            }}>
            {profileData.level}
          </Typography>
        </Stack>
        <Stack direction='row' alignItems={"center"} gap={1}>
          <Typography fontWeight={700} variant='body2' sx={{ flex: 0.1 }}>
            Points
          </Typography>
          <GuageBar
            value={profileData.points}
            maxValue={100 + (profileData.points || 1) * 50}
            height={15}
            sx={{
              flex: 1,
              fontSize: (theme) => theme.typography.pxToRem(12),
            }}
          />
        </Stack>
      </Stack>

      <Stack
        flex={1}
        gap={1}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}>
        <Typography variant='h5' fontWeight={700} gutterBottom>
          개인 정보
        </Typography>
        <Stack component={"form"} gap={2} onSubmit={formik.handleSubmit}>
          <TextField
            size='small'
            label='username'
            name='username'
            fullWidth
            value={formik.values.username}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            size='small'
            label='email'
            name='email'
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            size='small'
            label='birth'
            name='birth'
            type='date'
            value={timeFormat(formik.values.birth, "YYYY-MM-dd")}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.birth && Boolean(formik.errors.birth)}
            helperText={formik.touched.birth && formik.errors.birth}
          />
          <TextField
            size='small'
            label='phone number'
            name='phone_number'
            value={formik.values.phone_number}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phone_number && Boolean(formik.errors.phone_number)
            }
            helperText={
              formik.touched.phone_number && formik.errors.phone_number
            }
          />
          <Button variant='contained' color='success' type={"submit"}>
            정보 업데이트
          </Button>
        </Stack>
      </Stack>

      <Divider
        sx={{
          borderColor: "#56565656",
        }}
      />

      <Stack>
        <Alert color='error'>
          <AlertTitle>경고</AlertTitle>
          아래 옵션은 회원탈퇴하는 설정이 있습니다.
        </Alert>

        <Box sx={{ my: 3 }}>
          <Button color='error' variant='contained'>
            회원 탈퇴
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}

export default Profile;
