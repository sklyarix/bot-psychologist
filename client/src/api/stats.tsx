import { instance } from '../helpers/api.tsx';

export const statsApi = {
  visit: async () => {
    const { data } = await instance.post('/stats/visit', {});
    return data;
  },
};
