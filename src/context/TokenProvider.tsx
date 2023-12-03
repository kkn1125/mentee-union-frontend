import { ReactElement, createContext, useReducer } from "react";

export type IntialState = {
  token?: string;
  refresh?: string;
  // expired?: number;
  status: "loaded" | "init" | "fail";
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
  // expired?: number;
};

export const initialState: IntialState = {
  status: "init",
};

export const TokenContext = createContext(initialState);
export const TokenDispatchContext = createContext(new Function());

const reducer = (state: IntialState, action: ActionType) => {
  switch (action.type) {
    case TOKEN_ACTION.LOAD:
      return {
        ...state,
        status: JSON.parse(localStorage.getItem("user") || "{}").token
          ? "loaded"
          : "fail",
        ...JSON.parse(localStorage.getItem("user") || "{}"),
      };
    case TOKEN_ACTION.SAVE:
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: action.token,
          status: "loaded",
          refresh: action.refresh,
        })
      );
      return {
        ...state,
        status: "loaded",
        token: action.token,
        refresh: action.refresh,
      };
    case TOKEN_ACTION.SIGNOUT:
      localStorage.setItem("user", JSON.stringify({}));
      return {};
    default:
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
