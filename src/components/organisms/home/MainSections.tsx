import StickySidebar from "@/components/atoms/common/StickySidebar";
import LevelSystem from "@/components/moleculars/home/LevelSystem";
import {
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ReactElement } from "react";

interface MainSectionsProps {
  children: ReactElement | ReactElement[];
  userData: User | null;
}

function MainSections({ children, userData }: MainSectionsProps) {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {!mediaQuery && userData && (
          <Grid item xs={12} md={4}>
            <StickySidebar>
              <Typography variant='h5'>레벨 시스템</Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                레벨을 올리고 멘토가 되어보세요. 커뮤니티에 기여할수록 더 많은
                포인트를 얻을 수 있습니다.
              </Typography>
              <LevelSystem
                level={1}
                points={userData.points}
                maxPoints={100 + userData.level * 50}
              />
              {/* 레벨 표시 */}
              {/* ... */}
            </StickySidebar>
          </Grid>
        )}
        {/* Main post */}
        <Grid item xs={12} md={userData ? 8 : 12}>
          {children}
        </Grid>

        {/* Level system - Sticky sidebar */}
        {mediaQuery && userData && (
          <Grid item xs={12} md={4}>
            <StickySidebar>
              <Typography variant='h5'>나의 멘티 레벨</Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                레벨을 올리고 멘토가 되어보세요. 커뮤니티에 기여할수록 더 많은
                포인트를 얻을 수 있습니다.
              </Typography>
              <LevelSystem
                level={1}
                points={userData.points}
                maxPoints={100 + userData.level * 50}
              />
              {/* 레벨 표시 */}
              {/* ... */}
            </StickySidebar>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default MainSections;
