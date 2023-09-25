import ReactDOM from "react-dom/client";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App.tsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { AuthUserActionType, IUser } from "./entities/Auth.ts";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import http_common from "./http_common.ts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

if (localStorage.token) {
  const token = localStorage.token;
  http_common.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const user = jwtDecode(token) as IUser;
  store.dispatch({
    type: AuthUserActionType.LOGIN_USER,
    payload: {
      sub: user.sub,
      email: user.email,
      roles: user.roles,
    },
  });
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
