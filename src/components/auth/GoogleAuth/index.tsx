import { AiFillGoogleCircle } from "react-icons/ai";
import { useGoogleLogin } from "@react-oauth/google";
import http_common from "../../../http_common.ts";
import { LoginUserAction } from "../../../store/actions/AuthActions.ts";
import { useDispatch } from "react-redux";
import { IGoogleAuth, ITokenResponse } from "../../../entities/Auth.ts";

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const onGoogleRequest = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      const googleAuth: IGoogleAuth = {
        access_token,
      };
      console.log("Auth token info", tokenResponse);
      try {
        const result = await http_common.post<ITokenResponse>(
          "/api/account/google",
          googleAuth,
        );
        const { token } = result.data;
        LoginUserAction(dispatch, token);
      } catch (e) {
        console.log("Server is bad", e);
      }
    },
  });

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          onGoogleRequest();
        }}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <AiFillGoogleCircle className={"mr-2 text-2xl"} />
        Sign in with Google
      </button>
    </>
  );
};

export default GoogleAuth;
