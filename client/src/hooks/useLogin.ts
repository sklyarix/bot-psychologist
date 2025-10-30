import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { WebApp } from 'telegram-web-app';
import { authApi } from '../api/auth.tsx';
import { useAuth } from './useAuth.ts';

export interface AuthState {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  language: string;
  isPremium: boolean;
  coins: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export const useLogin = (webApp: WebApp | null) => {
  const { login, isAuth } = useAuth();
  const initData = webApp?.initData ?? '';
  const query = useQuery({
    queryKey: ['login', initData],
    enabled: Boolean(initData),
    queryFn: () => authApi.login(initData),
  });

  // в TanStack Query v5 убрали колбэки onSuccess/onError/onSettled
  useEffect(() => {
    if (query.isSuccess && query.data?.token) {
      login(query.data.token);
    }
  }, [isAuth, login, query.isSuccess, query.data?.token]);

  return query;
};
