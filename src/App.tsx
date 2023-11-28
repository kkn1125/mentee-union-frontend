import { Routes, Route } from "react-router-dom";
import Layout from "./components/templates/Layout";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import Signin from "./pages/auth/Signin";
import Community from "./pages/community/Index";
import SeminarDetail from "./pages/community/seminars/SeminarDetail";
import CommunityLayout from "./components/templates/CommunityLayout";
import AuthLayout from "./components/templates/AuthLayout";

function App() {
  return (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='*' element={<Notfound />} />
        <Route path='auth' element={<AuthLayout />}>
          <Route path='signin' element={<Signin />} />
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
