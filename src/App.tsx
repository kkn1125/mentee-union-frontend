import { Routes, Route } from "react-router-dom";
import Layout from "./components/templates/Layout";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";

function App() {
  return (
    <Routes>
      <Route path='' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='*' element={<Notfound />} />
      </Route>
    </Routes>
  );
}

export default App;
