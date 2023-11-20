import { ReactElement, createContext, useReducer } from "react";

export type IntialState = {
  token?: string;
  refresh?: string;
  expired?: number;
};

export enum TOKEN_ACTION {
  SAVE = "token/save",
}

type ActionType = {
  type: TOKEN_ACTION;
  token?: string;
  refresh?: string;
  expired?: number;
};

export const initialState: IntialState = {};

export const TokenContext = createContext(initialState);
export const TokenDispatchContext = createContext(new Function());

const reducer = (state: IntialState, action: ActionType) => {
  switch (action.type) {
    case TOKEN_ACTION.SAVE:
      return state;
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
