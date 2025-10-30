import { instance } from '../helpers/api.tsx';

export const authApi = {
  login: async (initData: string) => {
    const { data } = await instance.post('/login', { initData });
    return data;
  },
};
