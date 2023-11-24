import Placeholder from "@/components/moleculars/Placeholder";
import Section from "@/components/moleculars/Section";
import { ColorModeContext } from "@/context/ThemeProvider";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";

function Home() {
  const theme = useContext(ColorModeContext);

  useEffect(() => {}, []);

  function changeMode() {
    theme.toggleColorMode();
  }

  return (
    <Stack gap={10} sx={{ width: "60%", margin: "auto" }}>
      <Section>
        <Stack flex={1} gap={3}>
          <Typography variant='h3'>
            멘토와 멘티가 만들어나가는 커뮤니티페이지
          </Typography>
          <Typography variant='body1'>
            멘토와 멘티를 위한 전문적이고 역동적인 커뮤니티페이지에 오신 것을
            환영합니다. 우리의 목표는 지식을 공유하고 성장하기 위한 환경을
            제공하는 것입니다.
          </Typography>
          <Box>
            <Button variant='contained'>커뮤니티 가입하기</Button>
          </Box>
        </Stack>
        <Box sx={{ width: 300 }}>
          <Placeholder width={600} height={450} maxWidth />
        </Box>
      </Section>

      <Section>
        <Stack flex={1} gap={3}>
          <Typography variant='h3'>멘토와 멘티 소개</Typography>
          <Paper component={Stack} gap={1} sx={{ p: 3 }} elevation={5}>
            <Typography variant='h5'>멘토 소개</Typography>
            <Typography variant='body1'>
              우리의 멘토들은 각 분야에서의 전문성과 경험을 갖추고 있습니다.
              당신의 성공을 위해 최고의 조언과 지원을 드립니다.
            </Typography>
          </Paper>
          <Paper component={Stack} gap={1} sx={{ p: 3 }} elevation={5}>
            <Typography variant='h5'>멘티 소개</Typography>
            <Typography variant='body1'>
              우리의 멘티들은 열정과 도전 정신을 가지고 있습니다. 이
              커뮤니티에서 주변에서 배울 수 있는 멘토링 기회를 찾고 있습니다.
            </Typography>
          </Paper>
        </Stack>
        <Box sx={{ width: 300 }}>
          <Placeholder width={600} height={450} maxWidth />
        </Box>
      </Section>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>커뮤니티 가입 방법</Typography>
        <Stack direction='row' gap={3}>
          <Stack flex={1}>
            <Typography variant='h5'>단계 1</Typography>
            <Typography variant='body1'>
              가입 버튼을 클릭하여 멘토링 커뮤니티에 가입하세요.
            </Typography>
          </Stack>
          <Stack flex={1}>
            <Typography variant='h5'>단계 2</Typography>
            <Typography variant='body1'>
              프로필을 작성하고 자신을 소개하는 사진을 업로드하세요.
            </Typography>
          </Stack>
          <Stack flex={1}>
            <Typography variant='h5'>단계 3</Typography>
            <Typography variant='body1'>
              멘토링 프로그램에 참여하고 다른 커뮤니티 멤버들과 연결하세요.
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>멘토링 프로그램 소개</Typography>
        <Typography variant='body1'>
          우리의 멘토링 프로그램은 멘토와 멘티 간의 상호작용과 지식 공유를 위해
          설계되었습니다. 멘토링 세션과 워크샵을 통해 실무 경험을 쌓으며 성장할
          수 있습니다.
        </Typography>
        <Stack direction='row' gap={3}>
          <Stack flex={1} gap={2}>
            <Placeholder width={300} height={250} maxWidth />
            <Typography variant='h5'>멘토링 세션</Typography>
            <Typography variant='body1'>
              실시간 온라인 세션을 통해 멘토와 멘티가 정보를 주고받습니다.
            </Typography>
          </Stack>
          <Stack flex={1} gap={2}>
            <Placeholder width={300} height={250} maxWidth />
            <Typography variant='h5'>워크샵</Typography>
            <Typography variant='body1'>
              실무 경험을 바탕으로 한 워크샵에서 실전적인 스킬을 배웁니다.
            </Typography>
          </Stack>
          <Stack flex={1} gap={2}>
            <Placeholder width={300} height={250} maxWidth />
            <Typography variant='h5'>피드백</Typography>
            <Typography variant='body1'>
              멘티들은 멘토로부터 가치있는 피드백을 받으며 자신을 발전시킬 수
              있습니다.
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
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
      </Stack>

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
        <Box sx={{ width: 300 }}>
          <Placeholder width={600} height={450} maxWidth />
        </Box>
      </Section>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>커뮤니티 이벤트 정보</Typography>
        <Typography variant='body1'>
          커뮤니티에서 주최하는 다양한 이벤트에 참여하여 지식을 공유하고 새로운
          인맥을 만나보세요. 언제든지 참여 가능하며, 아래 버튼을 클릭하여 최신
          이벤트 정보를 확인하세요.
        </Typography>
        <Box>
          <Button variant='contained'>이벤트 정보 확인하기</Button>
        </Box>
      </Stack>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
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
              멘토를 찾아서 어떤 내용을 학습하고자 하는지 상세하게 고민해보세요.
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
      </Stack>

      <Stack flex={1} gap={5} sx={{ my: 2 }}>
        <Typography variant='h3'>함께 성장해요!</Typography>
        <Typography variant='body1'>
          멘토와 멘티가 함께 만들어나가는 멘토링 커뮤니티에 가입하세요. 우리의
          목표는 상호적인 지식 공유와 성장을 위한 환경을 제공하는 것입니다. 아래
          버튼을 클릭하여 가입하세요.
        </Typography>
        <Box>
          <Button variant='contained'>지금 가입하기</Button>
        </Box>
      </Stack>
    </Stack>
  );
}

export default Home;
