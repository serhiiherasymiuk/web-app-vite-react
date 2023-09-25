import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import LoginPage from "./LoginPage.tsx";

const Login = () => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={"6LcxSFIoAAAAAOfX7rJVzqjRBIv_8MpzMyqqoMv0"}
    >
      <LoginPage />
    </GoogleReCaptchaProvider>
  );
};

export default Login;
