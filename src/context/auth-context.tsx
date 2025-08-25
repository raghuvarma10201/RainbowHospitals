import {createContext, useContext} from 'react';
import {AuthContextProps} from '../types/context-types';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside its provider');
  return ctx;
};

export default AuthContext;
