import { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const COOKIE_TOKEN = import.meta.env.VITE_COOKIE_TOKEN;

type AuthProviderProps = React.PropsWithChildren;
type AuthContextValue = {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  isAuth: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  // Инициализация при монтировании
  useEffect(() => {
    setIsAuth(Boolean(Cookies.get(COOKIE_TOKEN)));
  }, []);

  const login = (token: string) => {
    // сервер может выдать токен — сохраняем куку с корректными атрибутами
    Cookies.set(COOKIE_TOKEN, token);
    setIsAuth(true);
  };

  const logout = () => {
    Cookies.remove(COOKIE_TOKEN);
    setIsAuth(false);
  };

  return <AuthContext.Provider value={{ isAuth, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
