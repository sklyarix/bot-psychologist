import { useAuth } from './useAuth';

export interface AuthState {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const useLogin = () => {
  const { login, logout, isAuth } = useAuth();

  const handleLoginSuccess = (token: string) => {
    login(token);
  };

  const handleLogout = () => {
    logout();
  };

  return {
    isAuth,
    handleLoginSuccess,
    handleLogout,
  };
};
