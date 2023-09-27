import ReactDOM from "react-dom/client";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { LoginUserAction } from "./store/actions/AuthActions.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

if (localStorage.token) {
  LoginUserAction(store.dispatch, localStorage.token);
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
