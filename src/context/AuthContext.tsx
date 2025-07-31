import { createContext, useContext } from "react";

type AuthCtx = {
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside its provider');
  return ctx;
};