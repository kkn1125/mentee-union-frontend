import { ReactElement, useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Loading from "./components/atoms/common/Loading";
import AuthLayout from "./components/templates/AuthLayout";
import BoardLayout from "./components/templates/BoardLayout";
import CommunityLayout from "./components/templates/CommunityLayout";
import Layout from "./components/templates/Layout";
import MentoringLayout from "./components/templates/MentoringLayout";
import UserLayout from "./components/templates/UserLayout";
import useGuards from "./hooks/useGuards";
import Logger from "./libs/logger";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import RequestResetPassword from "./pages/auth/RequestResetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import BoardDetail from "./pages/board/BoardDetail";
import Board from "./pages/board/Index";
import UpdateBoard from "./pages/board/UpdateBoard";
import WriteBoard from "./pages/board/WriteBoard";
import Community from "./pages/community/Index";
import ForumDetail from "./pages/community/forums/ForumDetail";
import Forums from "./pages/community/forums/Index";
import UpdateForum from "./pages/community/forums/UpdateForum";
import WriteForum from "./pages/community/forums/WriteForum";
import Mentoring from "./pages/community/mentoring/Index";
import Seminars from "./pages/community/seminars/Index";
import SeminarDetail from "./pages/community/seminars/SeminarDetail";
import UpdateSeminar from "./pages/community/seminars/UpdateSeminar";
import WriteSeminar from "./pages/community/seminars/WriteSeminar";
import MyMentee from "./pages/user/MyMentee";
import Profile from "./pages/user/Profile";
import { FAIL_MESSAGE } from "./util/global.constants";

interface ProtectedRouteProps {
  isSigned: boolean;
  redirect?: string;
  children: ReactElement | ReactElement[];
}
interface BlockedRouteProps {
  isSigned: boolean;
  redirect?: string;
  children: ReactElement | ReactElement[];
}

/* 로그인이 필요한 페이지 */
function ProtectedRoute({
  isSigned,
  redirect = "/",
  children,
}: ProtectedRouteProps) {
  if (isSigned === false) {
    alert(FAIL_MESSAGE.REQUIRE_SIGN_IN);
    return <Navigate to={redirect} replace />;
  }

  return children;
}

/* 로그인 후 접근 제한되는 페이지 */
function BlockedRoute({
  isSigned,
  redirect = "/",
  children,
}: BlockedRouteProps) {
  if (isSigned === true) {
    alert(FAIL_MESSAGE.ACCESS_DENIED);
    return <Navigate to={redirect} replace />;
  }

  return children;
}

const boardTypes = ["notice", "qna", "event"];

type SelectedRouteProps = {
  children: ReactElement;
  selected: string[];
};

const selectedRouteLogger = new Logger(SelectedRoute.name);
function SelectedRoute({ children, selected }: SelectedRouteProps) {
  const params = useParams();
  selectedRouteLogger.log(params.type, params.id);
  if (selected.includes(params.type as string)) {
    return children;
  } else {
    return <Notfound />;
  }
}

function App() {
  const [validated, token, guard, setGuard] = useGuards({
    signed: () => {},
    unsigned: () => {},
  });

  useEffect(() => {
    if (token.status === "exists") {
      setGuard((guard) => ({ ...guard, render: true }));
    } else if (token.status === "no-exists") {
      setGuard((guard) => ({ ...guard, render: false }));
    }
  }, [token.status]);

  return !validated ? (
    <Loading />
  ) : (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route
          path='boards'
          element={
            <SelectedRoute selected={boardTypes}>
              <BoardLayout />
            </SelectedRoute>
          }>
          <Route path=':type'>
            <Route
              path=''
              element={
                <SelectedRoute selected={boardTypes}>
                  <Board />
                </SelectedRoute>
              }
            />
            <Route
              path=':id'
              element={
                <SelectedRoute selected={boardTypes}>
                  <BoardDetail />
                </SelectedRoute>
              }
            />
            <Route
              path='edit'
              element={
                <ProtectedRoute isSigned={token.status === "exists"}>
                  <WriteBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path='edit/:id'
              element={
                <ProtectedRoute isSigned={token.status === "exists"}>
                  <UpdateBoard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path='auth' element={<AuthLayout />}>
          <Route
            path='signin'
            element={
              <BlockedRoute isSigned={token.status === "exists"}>
                <Signin />
              </BlockedRoute>
            }
          />
          <Route
            path='signup'
            element={
              <BlockedRoute isSigned={token.status === "exists"}>
                <Signup />
              </BlockedRoute>
            }
          />
          <Route path='request-pass' element={<RequestResetPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
        <Route
          path='user'
          element={
            <ProtectedRoute isSigned={token.status === "exists"}>
              <UserLayout />
            </ProtectedRoute>
          }>
          <Route path='profile' element={<Profile />} />
          <Route path='my-mentee' element={<MyMentee />} />
        </Route>
        <Route path='community'>
          <Route path='' element={<CommunityLayout />}>
            <Route path='' element={<Community />} />
            <Route path='seminars'>
              <Route path='' element={<Seminars />} />
              <Route path=':id' element={<SeminarDetail />} />
              <Route
                path='edit'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <WriteSeminar />
                  </ProtectedRoute>
                }
              />
              <Route
                path='edit/:id'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <UpdateSeminar />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path='forums'>
              <Route path='' element={<Forums />} />
              <Route
                path='edit'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <WriteForum />
                  </ProtectedRoute>
                }
              />
              <Route
                path='edit/:id'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <UpdateForum />
                  </ProtectedRoute>
                }
              />
              <Route path=':id' element={<ForumDetail />} />
            </Route>
          </Route>
          <Route
            element={
              <ProtectedRoute isSigned={token.status === "exists"}>
                <MentoringLayout />
              </ProtectedRoute>
            }>
            <Route path='mentoring'>
              <Route path='' element={<Mentoring />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<Notfound />} />
      </Route>
    </Routes>
  );
}

export default App;
