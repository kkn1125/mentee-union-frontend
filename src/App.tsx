import { Routes, Route } from "react-router-dom";
import Layout from "./components/templates/Layout";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import Signin from "./pages/auth/Signin";
import Community from "./pages/community/Index";
import SeminarDetail from "./pages/community/seminars/SeminarDetail";
import CommunityLayout from "./components/templates/CommunityLayout";
import AuthLayout from "./components/templates/AuthLayout";
import Signup from "./pages/auth/Signup";
import RequestResetPassword from "./pages/auth/RequestResetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/user/Profile";
import UserLayout from "./components/templates/UserLayout";

function App() {
  return (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='*' element={<Notfound />} />
        <Route path='auth' element={<AuthLayout />}>
          <Route path='signin' element={<Signin />} />
          <Route path='signup' element={<Signup />} />
          <Route path='request-pass' element={<RequestResetPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
        <Route path='user' element={<UserLayout />}>
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='community' element={<CommunityLayout />}>
          <Route path='' element={<Community />} />
          <Route path='seminars'>
            <Route path=':id' element={<SeminarDetail />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
