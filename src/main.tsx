import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import TokenProvider from "./context/TokenContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <TokenProvider>
        <App />
      </TokenProvider>
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </>
);
