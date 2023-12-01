import GuageBar from "@/components/atoms/GuageBar";
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
import { ChangeEvent, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";

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
  profile: yup.object().shape({
    file: yup.mixed(),
  }),
});

function Profile() {
  const token = useContext(TokenContext);
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [profilePreview, setProfilePreview] = useState("");

  const formik = useFormik<{
    profile: File | null;
    profileField: string;
    username: string;
    email: string;
    birth: string;
    phone_number: string;
  }>({
    initialValues: {
      profile: null,
      profileField: "",
      username: "",
      email: "",
      birth: "",
      phone_number: "",
    },
    validationSchema: validationSchema,
    validate(values) {
      const errors: {
        profile?: string;
        profileField?: string;
        email?: string;
        birth?: string;
        phone_number?: string;
      } = {};
      const matched = values.email.match(
        /\b(?=.*[A-Za-z])(?=.*[0-9_\-.])[A-Za-z0-9_\-.]+@(?=.*[A-Za-z]?)(?=.*[0-9_-]*)[A-Za-z0-9_-]+\.(?=.*[A-Za-z]\b)(?!.*[.])[A-Za-z]+/g
      );
      if (!matched || matched[0] !== values.email) {
        errors.email = "email must be a valid email";
      }
      if (values.profile && values.profile.size / 1024 > 10) {
        errors.profileField = `프로필 이미지 사이즈는 10kb 이하여야 합니다.`;
      }
      return errors;
    },
    onSubmit: (values) => {
      console.log(values);
      alert("test");
    },
  });

  useEffect(() => {
    if (token.token) {
      axiosInstance
        .get(`/users/profile`, {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          const originData = data.data;
          const convertedProfileData = convertDateStringPropertyToDate(
            originData
          ) as User;
          setProfileData(convertedProfileData);

          formik.setValues({
            profile: null,
            profileField: "",
            username: convertedProfileData.username,
            email: convertedProfileData.email,
            birth: originData.birth,
            phone_number: convertedProfileData.phone_number,
          });
        });
    }
  }, [token]);

  function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    handleResetFile();
    const file = e.target.files?.item(0);
    if (file) {
      formik.values.profile = file;
      setProfilePreview(URL.createObjectURL(file));
    }
  }

  function handleResetFile() {
    const upload = document.getElementById("profile-image") as HTMLInputElement;
    upload.files = null;
    formik.values.profile = null;
    setProfilePreview("");
  }

  function handleSubmitProfile() {
    if (formik.touched.profileField && Boolean(formik.errors.profileField)) {
      alert("프로필 이미지 사이즈를 맞춰주세요.");
    } else {
      axiosInstance
        .put("/users/profile", {
          profile: formik.values.profile,
        })
        .then(({ data }) => {
          if (data.ok) {
            formik.values.profile = null;
            formik.values.profileField = "";
          }
        });
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <Stack gap={5} sx={{ width: "60%", margin: "auto", pt: 5 }}>
      <Stack flex={1} gap={1}>
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
            if (file && file !== formik.values.profile) {
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
        {formik.values.profile && (
          <Typography>
            {(formik.values.profile.size / 1024).toFixed(2)}Kb
          </Typography>
        )}
        {formik.touched.profileField && Boolean(formik.errors.profileField) && (
          <FormHelperText
            error={
              formik.touched.profileField && Boolean(formik.errors.profileField)
            }>
            {formik.touched.profileField && formik.errors.profileField}
          </FormHelperText>
        )}
        <Stack
          direction='row'
          gap={3}
          sx={{
            my: 1,
          }}>
          <Button variant='contained' onClick={handleSubmitProfile}>
            프로필 변경
          </Button>
          <Button color='error' variant='contained' onClick={handleResetFile}>
            프로필 제거
          </Button>
        </Stack>
      </Stack>

      <Stack flex={1} gap={1}>
        <Typography variant='h5'>나의 멘티 정보</Typography>
        <Stack direction='row' alignItems={"center"} gap={1}>
          <Typography fontWeight={700} variant='body2' sx={{ flex: 0.1 }}>
            Level
          </Typography>
          <Typography variant='body2' sx={{ flex: 0.1 }}>
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
            sx={{
              flex: 1,
            }}
          />
        </Stack>
      </Stack>
      <Stack flex={1} gap={1}>
        <TextField
          size='small'
          label='username'
          name='username'
          focused={!!profileData.username}
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
          focused={!!profileData.email}
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
          focused={!!profileData.birth}
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
          focused={!!profileData.phone_number}
          value={formik.values.phone_number}
          onChange={(e) => {
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
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
