import { ReactElement, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/templates/AuthLayout";
import CommunityLayout from "./components/templates/CommunityLayout";
import Layout from "./components/templates/Layout";
import MentoringLayout from "./components/templates/MentoringLayout";
import UserLayout from "./components/templates/UserLayout";
import useGuards from "./hooks/useGuards";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import RequestResetPassword from "./pages/auth/RequestResetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import Community from "./pages/community/Index";
import ForumDetail from "./pages/community/forums/ForumDetail";
import Mentoring from "./pages/community/mentoring/Index";
import SeminarDetail from "./pages/community/seminars/SeminarDetail";
import Profile from "./pages/user/Profile";
import { FAIL_MESSAGE } from "./util/global.constants";
import Loading from "./components/atoms/Loading";

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
      {/* <Route path='test' element={<Test />} /> */}
      <Route path='' element={<Layout />}>
        <Route path='' element={<Home />} />
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
        </Route>
        <Route path='community'>
          <Route path='' element={<CommunityLayout />}>
            <Route path='' element={<Community />} />
            <Route path='seminars'>
              <Route
                path=':id'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <SeminarDetail />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path='forums'>
              <Route
                path=':id'
                element={
                  <ProtectedRoute isSigned={token.status === "exists"}>
                    <ForumDetail />
                  </ProtectedRoute>
                }
              />
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
