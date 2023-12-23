import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  Grid,
  List,
  ListItem,
  styled,
} from "@mui/material";
import { axiosInstance } from "@/util/instances";
import SeminarItem from "@/components/atoms/SeminarItem";
import LevelSystem from "@/components/moleculars/home/LevelSystem";

const StickySidebar = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: theme.spacing(10), // 예를 들어, 상단에서 10vh
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

function Test() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);

  useEffect(() => {
    axiosInstance.get("/seminars").then(({ data }) => {
      setSeminars(data.data);
    });
  }, []);

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            BrandName
          </Typography>
          <Button color='inherit'>About Us</Button>
          <Button color='inherit'>Services</Button>
          <Button color='inherit'>Products</Button>
          <Button color='inherit'>Contact</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          height: "75vh",
          backgroundImage:
            "url(https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
        }}>
        <Typography variant='h2' gutterBottom>
          성장을 함께하는 멘티 커뮤니티
        </Typography>
        <Typography variant='h5' sx={{ px: 3 }}>
          멘티들이 모여 세미나와 지식을 공유하며, 멘토링 기회를 얻는 곳입니다.
        </Typography>
        <Button variant='contained' size='large' sx={{ mt: 2 }}>
          지금 시작하기
        </Button>
      </Box>

      {/* Main content */}
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Main post */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <Typography variant='h4' gutterBottom>
                세미나
              </Typography>
              <Typography variant='body1'>
                다가오는 세미나 일정과 과거 세미나 요약을 확인하고 참여해
                보세요.
              </Typography>
              {/* 세미나 목록 */}
              <List>
                {/* 세미나 항목 */}
                {/* <ListItem button>
                  <Typography variant='h6'>세미나 1</Typography>
                </ListItem>
                <ListItem button>
                  <Typography variant='h6'>세미나 2</Typography>
                </ListItem> */}
                {/* 더 많은 세미나 항목들 */}
                {seminars.map((seminar) => (
                  <SeminarItem
                    key={seminar.id}
                    host_id={seminar.host_id} // 예시 데이터를 적절한 필드로 대체해야 함
                    category_id={seminar.category_id} // 예시 데이터를 적절한 필드로 대체해야 함
                    title={seminar.title}
                    content={seminar.content}
                    meeting_place={seminar.meeting_place}
                    limit_participant_amount={seminar.limit_participant_amount}
                    recruit_start_date={seminar.recruit_start_date}
                    recruit_end_date={seminar.recruit_end_date}
                    seminar_start_date={seminar.seminar_start_date}
                    seminar_end_date={seminar.seminar_end_date}
                    is_recruit_finished={seminar.is_recruit_finished}
                    is_seminar_finished={seminar.is_seminar_finished}
                    user={seminar.user}
                    category={seminar.category}
                    id={seminar.id}
                    deleted_at={seminar.deleted_at}
                    created_at={seminar.created_at}
                    updated_at={seminar.updated_at}
                    seminarParticipants={seminar.seminarParticipants} // ... 기타 필요한 props ...
                  />
                ))}
              </List>
            </Paper>

            {/* Information sharing section */}
            <Paper elevation={0} sx={{ p: 2, mt: 3 }}>
              <Typography variant='h4' gutterBottom>
                정보 공유
              </Typography>
              <Typography variant='body1'>
                멘티들이 공유하는 유용한 정보와 지식을 발견하고, 나누세요.
              </Typography>
              {/* 정보 공유 게시물 */}
              {/* ... */}
            </Paper>

            {/* Another section */}
            <Paper elevation={0} sx={{ p: 2, mt: 3 }}>
              <Typography variant='h4' gutterBottom>
                커뮤니티 스토리
              </Typography>
              <Typography variant='body1'>
                멘티들의 성장 스토리와 경험을 들려주세요.
              </Typography>
              {/* 커뮤니티 스토리 게시물 */}
              {/* ... */}
            </Paper>
          </Grid>

          {/* Level system - Sticky sidebar */}
          <Grid item xs={12} md={4}>
            <StickySidebar>
              <Typography variant='h5'>레벨 시스템</Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                레벨을 올리고 멘토가 되어보세요. 커뮤니티에 기여할수록 더 많은
                포인트를 얻을 수 있습니다.
              </Typography>
              <LevelSystem level={1} points={2} maxPoints={100} />
              {/* 레벨 표시 */}
              {/* ... */}
            </StickySidebar>
          </Grid>
        </Grid>
      </Container>

      <Paper elevation={0} sx={{ p: 2, my: 4, backgroundColor: "#f7f7f7" }}>
        <Typography variant='h4' gutterBottom>
          Testimonials
        </Typography>
        {/* Testimonials go here */}
      </Paper>

      {/* Additional sections can be added here */}

      <footer>
        <Typography
          variant='body2'
          color='textSecondary'
          align='center'
          sx={{ py: 3 }}>
          © 2023 BrandName
        </Typography>
      </footer>
    </>
  );
}

export default Test;
