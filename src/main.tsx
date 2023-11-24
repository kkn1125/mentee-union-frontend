import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./assets/main.scss";
import TokenProvider from "./context/TokenProvider.tsx";
import ThemeProvider from "./context/ThemeProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    {/* <React.StrictMode> */}
    <ThemeProvider>
      <BrowserRouter>
        <TokenProvider>
          <App />
        </TokenProvider>
      </BrowserRouter>
    </ThemeProvider>
    {/* </React.StrictMode> */}
  </>
);
