import Loading from "@/components/atoms/Loading";
import { TokenContext } from "@/context/TokenProvider";
import { axiosInstance } from "@/util/instances";
import { Stack, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

function Profile() {
  const token = useContext(TokenContext);
  const [profileData, setProfileData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    if (token.token) {
      axiosInstance
        .get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token.token,
          },
        })
        .then(({ data }) => {
          setLoading(false);
          console.log(data.data);
          setProfileData(data.data);
        });
    }
  }, [token]);

  return loading ? (
    <Loading />
  ) : (
    <Stack gap={5} sx={{ width: "60%", margin: "auto" }}>
      <Stack flex={1} gap={1}>
        <Typography variant='h3'>프로필</Typography>
        <Typography variant='body1'>
          프로필을 완성하고 멘티들에게 자신을 알리세요!
        </Typography>
      </Stack>
      <Stack flex={1} gap={1}>
        <Typography variant='body2'>Level {profileData.level}</Typography>
      </Stack>
      <Stack flex={1} gap={1}>
        <TextField size='small' label='username' name='username' />
        <TextField size='small' label='email' name='email' />
        <TextField size='small' label='birth' name='birth' />
        <TextField size='small' label='phone number' name='phone_number' />
      </Stack>
    </Stack>
  );
}

export default Profile;
