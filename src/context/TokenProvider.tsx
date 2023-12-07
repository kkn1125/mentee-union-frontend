import { ReactElement, createContext, useReducer } from "react";

export type IntialState = {
  token?: string;
  refresh?: string;
  expired?: number;
  status?: "exists" | "no-exists";
  keep_sign: boolean;
};

export enum TOKEN_ACTION {
  LOAD = "token/load",
  SAVE = "token/save",
  SIGNOUT = "token/signout",
}

type ActionType = {
  type: TOKEN_ACTION;
  token?: string;
  refresh?: string;
  keep_sign?: boolean;
  // expired?: number;
};

export const initialState: IntialState = {
  status: undefined,
  keep_sign: false,
};

export const TokenContext = createContext(initialState);
export const TokenDispatchContext = createContext(new Function());

const reducer = (state: IntialState, action: ActionType) => {
  if (action.type === TOKEN_ACTION.LOAD) {
    const userItem = localStorage.getItem("user");
    const user = JSON.parse(userItem || "{}");
    return {
      ...state,
      status: user.token ? "exists" : "no-exists",
      ...user,
    };
  } else if (action.type === TOKEN_ACTION.SAVE) {
    const data = {
      ...state,
      token: action.token,
      status: "exists",
      refresh: action.refresh,
      keep_sign: action.keep_sign,
    };
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } else if (action.type === TOKEN_ACTION.SIGNOUT) {
    const data = {
      status: undefined,
    };
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } else {
    return state;
  }
};

function TokenProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TokenDispatchContext.Provider value={dispatch}>
      <TokenContext.Provider value={state}>{children}</TokenContext.Provider>
    </TokenDispatchContext.Provider>
  );
}

export default TokenProvider;
