import {
  IntialState,
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import Logger from "@/libs/logger";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Dispatch, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Guard {
  render?: boolean;
  signed?: () => void;
  unsigned?: () => void;
}

const logger = new Logger(useGuards.name);

function useGuards(initGuard?: Guard) {
  const locate = useLocation();
  const navigate = useNavigate();
  const token = useContext(TokenContext);
  const tokenDispatch = useContext(TokenDispatchContext);
  const [guard, setGuard] = useState<Guard>(initGuard || { render: undefined });
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    tokenDispatch({
      type: TOKEN_ACTION.LOAD,
    });
  }, []);

  useEffect(() => {
    (async () => {
      const access_token = token.token;
      const tokenUndefined = token.status !== undefined;
      const tokenExists = token.status === "exists" && access_token;

      if (!tokenUndefined) return;

      if (!tokenExists) {
        guard.unsigned?.();
        setValidated(true);
        return;
      }

      try {
        await validateToken(access_token);
        guard.signed?.();
        setValidated(true);
      } catch (error: any) {
        const IS_NETWORK_ERROR = error.message === "Network Error";
        if (IS_NETWORK_ERROR) {
          alert(
            FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN +
              "\n보안을 위해 로그인 정보는 삭제됩니다."
          );
          signOut();
          setValidated(true);
          return;
        }

        const message = error.response.data.message;
        const detail = error.response.data.detail;

        const IS_NOT_FOUND_MESSAGE =
          message === "not found" || message === "not found user";
        const IS_NO_TOKEN = message === "no token";
        const IS_JWT_EXPIRED = detail === "jwt expired";

        if (IS_NOT_FOUND_MESSAGE) {
          alert(FAIL_MESSAGE.NO_ACCOUNT);
          signOut();
          navigate("/");
        } else if (IS_NO_TOKEN) {
          alert(FAIL_MESSAGE.MALFORMED_TOKEN);
          signOut();
          navigate("/");
        } else if (IS_JWT_EXPIRED) {
          if (token.keep_sign) {
            logger.log("try keep sign state as user's refresh token");
            reTrySignin();
          } else {
            alert(FAIL_MESSAGE.EXPIRED_TOKEN);
            signOut();
            navigate("/");
          }
        } else {
          alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
          navigate("/");
        }

        setValidated(true);
      }
    })();
  }, [token.status, locate.pathname]);

  async function reTrySignin() {
    try {
      const { data } = await axiosInstance.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: "Bearer " + token.refresh,
          },
        }
      );
      tokenDispatch({
        type: TOKEN_ACTION.SAVE,
        token: data.access_token,
        refresh: data.refresh_token,
        keep_sign: token.keep_sign,
      });
      guard.signed?.();
      setValidated(true);
    } catch (err: any) {
      const _message = err.response.data.message;
      const _detail = err.response.data.detail;
      if (_message === "not found" || _message === "not found user") {
        alert(FAIL_MESSAGE.NO_ACCOUNT);
        tokenDispatch({
          type: TOKEN_ACTION.SIGNOUT,
        });
        navigate("/");
      } else if (_message === "no token") {
        alert(FAIL_MESSAGE.MALFORMED_TOKEN);
        tokenDispatch({
          type: TOKEN_ACTION.SIGNOUT,
        });
        navigate("/");
      } else if (_detail === "jwt expired") {
        alert(FAIL_MESSAGE.EXPIRED_TOKEN);
        tokenDispatch({
          type: TOKEN_ACTION.SIGNOUT,
        });
        navigate("/");
      } else {
        alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
        navigate("/");
      }
    }
  }

  function signOut() {
    tokenDispatch({
      type: TOKEN_ACTION.SIGNOUT,
    });
  }

  function validateToken(_token: string) {
    return axiosInstance.get("/auth/profile", {
      headers: {
        Authorization: "Bearer " + token.token,
      },
    });
  }

  return [validated, token, guard, setGuard] as [
    boolean,
    IntialState,
    Guard,
    Dispatch<React.SetStateAction<Guard>>
  ];
}

export default useGuards;
