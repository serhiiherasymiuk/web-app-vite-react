import ReactDOM from "react-dom/client";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
);
