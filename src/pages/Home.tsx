import SeminarItem from "@/components/atoms/seminar/SeminarItem";
import PaperContent from "@/components/atoms/home/PaperContent";
import Step from "@/components/atoms/home/Step";
import FlowIssues from "@/components/moleculars/home/FlowIssues";
import Placeholder from "@/components/moleculars/common/Placeholder";
import Section from "@/components/moleculars/common/Section";
import BackgroundSection from "@/components/organisms/home/BackgroundSection";
import MainSections from "@/components/organisms/home/MainSections";
import { TokenContext } from "@/context/TokenProvider";
import { CHECK_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import {
  Box,
  Button,
  Container,
  List,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.up("md"));
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (token.status === "exists") {
      if (token.token) {
        axiosInstance
          .get("/users/profile", {
            headers: {
              Authorization: "Bearer " + token.token,
            },
          })
          .then(({ data }) => {
            setUserData(data.data);
          });
      } else {
        setUserData(null);
      }
    }
  }, [token.status]);

  function handleRedirect(path: string | number) {
    if (typeof path === "string") {
      navigate(path);
    } else {
      navigate(path);
    }
  }

  return (
    <Stack gap={mediaQuery ? 10 : 1}>
      <BackgroundSection />
      <MainSections userData={userData}>
        <Section>
          <Stack flex={1} gap={3}>
            <Typography variant='h4'>
              멘토와 멘티가 만들어나가는 커뮤니티페이지
            </Typography>
            <Typography variant='body2'>
              멘토와 멘티를 위한 전문적이고 역동적인 커뮤니티페이지에 오신 것을
              환영합니다. 우리의 목표는 지식을 공유하고 성장하기 위한 환경을
              제공하는 것입니다.
            </Typography>
            <Box>
              <Button
                variant='contained'
                onClick={() =>
                  token.token
                    ? handleRedirect("community")
                    : handleRedirect(
                        confirm(CHECK_MESSAGE.REQUIRED_SIGN_IN)
                          ? "/auth/signin"
                          : "/"
                      )
                }>
                커뮤니티 참여하기
              </Button>
            </Box>
          </Stack>
          {mediaQuery && (
            <Stack sx={{ width: 300 }}>
              <Placeholder
                width={600}
                height={350}
                maxWidth
                src={"/assets/home/workshop.png"}
              />
            </Stack>
          )}
        </Section>

        <Section>
          <Stack flex={1} gap={3}>
            <Typography variant='h4'>멘토와 멘티 소개</Typography>
            <PaperContent
              title='멘토 소개'
              content='우리의 멘토들은 각 분야에서의 전문성과 경험을 갖추고 있습니다.
              당신의 성공을 위해 최고의 조언과 지원을 드립니다.'
            />
            <PaperContent
              title='멘티 소개'
              content='우리의 멘티들은 열정과 도전 정신을 가지고 있습니다. 이
              커뮤니티에서 주변에서 배울 수 있는 멘토링 기회를 찾고 있습니다.'
            />
          </Stack>
          {mediaQuery && (
            <Stack sx={{ width: 300 }}>
              <Placeholder
                width={600}
                height={450}
                maxWidth
                src={"/assets/home/mentoring.png"}
              />
            </Stack>
          )}
        </Section>

        <Section type='horizon'>
          <Typography variant='h4'>커뮤니티 가입 방법</Typography>
          <Stack direction={mediaQuery ? "row" : "column"} gap={3}>
            <Step
              order={1}
              title='단계'
              content='가입 버튼을 클릭하여 멘토링 커뮤니티에 가입하세요.'
            />
            <Step
              order={2}
              title='단계'
              content='프로필을 작성하고 자신을 소개하는 사진을 업로드하세요.'
            />
            <Step
              order={3}
              title='단계'
              content='멘토링 프로그램에 참여하고 다른 커뮤니티 멤버들과 연결하세요.'
            />
          </Stack>
        </Section>

        <Paper elevation={0} sx={{ p: 5 }}>
          <Typography variant='h4' gutterBottom>
            세미나
          </Typography>
          <Typography variant='body1'>
            다가오는 세미나 일정과 과거 세미나 요약을 확인하고 참여해 보세요.
          </Typography>
          {/* 세미나 목록 */}
          <Button
            size='large'
            variant='contained'
            sx={{ mt: 2 }}
            onClick={() => handleRedirect("/community/seminars")}>
            세미나 참여하기
          </Button>
        </Paper>

        {/* Information sharing section */}
        <Paper elevation={0} sx={{ p: 5, mt: 3 }}>
          <Typography variant='h4' gutterBottom>
            정보 공유
          </Typography>
          <Typography variant='body1'>
            멘티들이 공유하는 유용한 정보와 지식을 발견하고, 나누세요.
          </Typography>
          {/* 정보 공유 게시물 */}
          {/* ... */}
          <Button
            size='large'
            variant='contained'
            sx={{ mt: 2 }}
            onClick={() => handleRedirect("/community/forums")}>
            정보 공유 참여하기
          </Button>
        </Paper>

        {/* Another section */}
        <Paper elevation={0} sx={{ p: 5, mt: 3 }}>
          <Typography variant='h4' gutterBottom>
            커뮤니티 스토리
          </Typography>
          <Typography variant='body1'>
            멘티들의 성장 스토리와 경험을 들려주세요.
          </Typography>
          {/* 커뮤니티 스토리 게시물 */}
          {/* ... */}
        </Paper>
      </MainSections>

      <Container
        maxWidth='lg'
        sx={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Section type='horizon'>
          <Typography variant='h3'>멘토링 프로그램 소개</Typography>
          <Typography variant='body1'>
            우리의 멘토링 프로그램은 멘토와 멘티 간의 상호작용과 지식 공유를
            위해 설계되었습니다. 멘토링 세션과 워크샵을 통해 실무 경험을 쌓으며
            성장할 수 있습니다.
          </Typography>
          <Stack direction={mediaQuery ? "row" : "column"} gap={3}>
            <Stack flex={1} gap={2}>
              <Placeholder
                width={300}
                height={250}
                maxWidth
                src={"/assets/home/mentoring2.png"}
              />
              <Typography variant='h5'>멘토링 세션</Typography>
              <Typography variant='body1'>
                실시간 온라인 세션을 통해 멘토와 멘티가 정보를 주고받습니다.
              </Typography>
            </Stack>
            <Stack flex={1} gap={2}>
              <Placeholder
                width={300}
                height={250}
                maxWidth
                src={"/assets/home/seminar.png"}
              />
              <Typography variant='h5'>워크샵</Typography>
              <Typography variant='body1'>
                실무 경험을 바탕으로 한 워크샵에서 실전적인 스킬을 배웁니다.
              </Typography>
            </Stack>
            <Stack flex={1} gap={2}>
              <Placeholder
                width={300}
                height={250}
                maxWidth
                src={"/assets/home/feedback.png"}
              />
              <Typography variant='h5'>피드백</Typography>
              <Typography variant='body1'>
                멘티들은 멘토로부터 가치있는 피드백을 받으며 자신을 발전시킬 수
                있습니다.
              </Typography>
            </Stack>
          </Stack>
        </Section>

        <Section type='horizon'>
          <Typography variant='h3'>멘토링 진행 방식</Typography>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>1</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>단계 1</Typography>
              <Typography variant='body1'>
                멘티는 목표를 설정하고 멘토와 상담을 통해 개인화된 계획을
                수립합니다.
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>2</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>단계 2</Typography>
              <Typography variant='body1'>
                멘토와 멘티는 주기적으로 만나고 진행 상황을 확인하며 목표 달성을
                지원합니다.
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>3</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>단계 3</Typography>
              <Typography variant='body1'>
                멘토와 멘티는 함께 성장하고 결과를 평가하며 더 나은 방향으로
                나아갑니다.
              </Typography>
            </Stack>
          </Stack>
        </Section>

        <Section>
          <Stack flex={1} gap={3}>
            <Typography variant='h3'>멘토링 후기 및 경험담</Typography>
            <Paper component={Stack} gap={1} sx={{ p: 3 }} elevation={5}>
              <Typography variant='h5'>멘토링 후기</Typography>
              <Typography variant='body1'>
                멘토링 프로그램에 참여한 멘티들의 회고록과 경험담을 확인하세요.
              </Typography>
            </Paper>
            <Paper component={Stack} gap={1} sx={{ p: 3 }} elevation={5}>
              <Typography variant='h5'>멘토링 이야기</Typography>
              <Typography variant='body1'>
                멘토링을 통해 변화를 겪은 멘토들의 이야기를 들어보세요.
              </Typography>
            </Paper>
          </Stack>
          {mediaQuery && (
            <Stack
              sx={{
                width: 300,
                overflow: "hidden",
                backgroundColor: (theme) => theme.palette.bg.main,
              }}>
              <FlowIssues
                width={600}
                height={450}
                issues={[
                  {
                    id: 1,
                    title: "test1",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 2,
                    title: "test2",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 3,
                    title: "test3",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 4,
                    title: "test4",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 5,
                    title: "test5",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 6,
                    title: "test6",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 7,
                    title: "test7",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 8,
                    title: "test8",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 9,
                    title: "test9",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 10,
                    title: "test10",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 11,
                    title: "test11",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 12,
                    title: "test12",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 13,
                    title: "test13",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 14,
                    title: "test14",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 15,
                    title: "test15",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 16,
                    title: "test16",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 17,
                    title: "test17",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 18,
                    title: "test18",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 19,
                    title: "test19",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 20,
                    title: "test20",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 21,
                    title: "test21",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                  {
                    id: 22,
                    title: "test22",
                    content:
                      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, ratione?",
                  },
                ]}
              />
              {/* <Placeholder width={600} height={450} maxWidth /> */}
            </Stack>
          )}
        </Section>

        <Section type='horizon'>
          <Typography variant='h3'>커뮤니티 이벤트 정보</Typography>
          <Typography variant='body1'>
            커뮤니티에서 주최하는 다양한 이벤트에 참여하여 지식을 공유하고
            새로운 인맥을 만나보세요. 언제든지 참여 가능하며, 아래 버튼을
            클릭하여 최신 이벤트 정보를 확인하세요.
          </Typography>
          <Box>
            <Button variant='contained'>이벤트 정보 확인하기</Button>
          </Box>
        </Section>

        <Section type='horizon'>
          <Typography variant='h3'>자주 묻는 질문 (FAQ)</Typography>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>1</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>가입 방법은 어떻게 되나요?</Typography>
              <Typography variant='body1'>
                커뮤니티에 가입하기 위해서는 홈페이지의 가입 버튼을 클릭하면
                됩니다. 가입 절차가 간단하니 언제든지 시작하세요!
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>2</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>
                멘토링 프로그램은 어떤 내용을 다루나요?
              </Typography>
              <Typography variant='body1'>
                멘토링 프로그램은 다양한 주제와 분야를 다룹니다. 자신에게 맞는
                멘토를 찾아서 어떤 내용을 학습하고자 하는지 상세하게
                고민해보세요.
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={5}>
            <Typography variant='h5'>3</Typography>
            <Stack gap={1}>
              <Typography variant='h5'>
                이벤트에 참여하려면 어떻게 해야 하나요?
              </Typography>
              <Typography variant='body1'>
                이벤트에 참여하려면 홈페이지에서 이벤트 정보를 확인하고 신청
                양식을 작성하세요. 참여 정원이 제한되어 있을 수 있으니 서둘러
                신청하세요!
              </Typography>
            </Stack>
          </Stack>
        </Section>

        <Section type='horizon'>
          <Typography variant='h3'>함께 성장해요!</Typography>
          <Typography variant='body1'>
            멘토와 멘티가 함께 만들어나가는 멘토링 커뮤니티에 가입하세요. 우리의
            목표는 상호적인 지식 공유와 성장을 위한 환경을 제공하는 것입니다.
            아래 버튼을 클릭하여 가입하세요.
          </Typography>
          {!token.token && (
            <Box>
              <Button
                variant='contained'
                onClick={() => navigate("/auth/signup")}>
                지금 가입하기
              </Button>
            </Box>
          )}
        </Section>
      </Container>
    </Stack>
  );
}

export default Home;
