import { instance } from '../helpers/api.tsx';

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await instance.post('/auth/login', { email, password });
    return data;
  },
  register: async (email: string, password: string) => {
    const { data } = await instance.post('/auth/register', { email, password });
    return data;
  },
  checkEmail: async (email: string) => {
    const { data } = await instance.post('/auth/check-email', { email });
    return data;
  },
};
