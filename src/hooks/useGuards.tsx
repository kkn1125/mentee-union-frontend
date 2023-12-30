import {
  IntialState,
  TOKEN_ACTION,
  TokenContext,
  TokenDispatchContext,
} from "@/context/TokenProvider";
import { FAIL_MESSAGE } from "@/util/global.constants";
import { axiosInstance } from "@/util/instances";
import { Dispatch, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Guard {
  render?: boolean;
  signed?: () => void;
  unsigned?: () => void;
}

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
      if (token.status !== undefined) {
        if (token.status === "exists" && token.token) {
          try {
            await validateToken(token.token);
            guard.signed?.();
            setValidated(true);
          } catch (error: any) {
            // console.log(error);
            if (error.message === "Network Error") {
              alert(
                FAIL_MESSAGE.PROBLEM_WITH_SERVER_ASK_ADMIN +
                  "\n보안을 위해 로그인 정보는 삭제됩니다."
              );
              tokenDispatch({
                type: TOKEN_ACTION.SIGNOUT,
              });
              setValidated(true);
              return;
            }
            const message = error.response.data.message;
            const detail = error.response.data.detail;
            if (message === "not found" || message === "not found user") {
              alert(FAIL_MESSAGE.NO_ACCOUNT);
              tokenDispatch({
                type: TOKEN_ACTION.SIGNOUT,
              });
              navigate("/");
            } else if (message === "no token") {
              alert(FAIL_MESSAGE.MALFORMED_TOKEN);
              tokenDispatch({
                type: TOKEN_ACTION.SIGNOUT,
              });
              navigate("/");
            } else if (detail === "jwt expired") {
              if (token.keep_sign) {
                console.log("try keep sign state as user's refresh token");
                axiosInstance
                  .post(
                    "/auth/refresh",
                    {},
                    {
                      headers: {
                        Authorization: "Bearer " + token.refresh,
                      },
                    }
                  )
                  .then(({ data }) => {
                    tokenDispatch({
                      type: TOKEN_ACTION.SAVE,
                      token: data.access_token,
                      refresh: data.refresh_token,
                      keep_sign: token.keep_sign,
                    });
                    guard.signed?.();
                    setValidated(true);
                  })
                  .catch((err) => {
                    const _message = err.response.data.message;
                    const _detail = err.response.data.detail;
                    if (
                      _message === "not found" ||
                      _message === "not found user"
                    ) {
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
                  });
              } else {
                alert(FAIL_MESSAGE.EXPIRED_TOKEN);
                tokenDispatch({
                  type: TOKEN_ACTION.SIGNOUT,
                });
                navigate("/");
              }
            } else {
              alert(FAIL_MESSAGE.PROBLEM_WITH_SERVER);
              navigate("/");
            }
            setValidated(true);
          }
        } else {
          guard.unsigned?.();
          setValidated(true);
        }
      }
    })();
  }, [token.status, locate.pathname]);

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
