import { instance } from '../helpers/api.tsx';

export const aiApi = {
  createAiGoal: async (title: string) => {
    const { data } = await instance.post(`/ai/goals`, { title }, { timeout: 180_000 });
    return data;
  },
  getAllAiGoal: async () => {
    const { data } = await instance.get(`/ai/goals`, {});
    return data;
  },
  getIdAiGoal: async (id: string) => {
    const { data } = await instance.get(`/ai/goals/${id}`, {});
    return data;
  },

  createAiQA: async (question: string) => {
    const { data } = await instance.post(`/ai/qa`, { question }, { timeout: 180_000 });
    return data;
  },
  getAllAiQA: async () => {
    const { data } = await instance.get(`/ai/qa`, {});
    return data;
  },
  getIdAiQA: async (id: string) => {
    const { data } = await instance.get(`/ai/qa/${id}`, {});
    return data;
  },
};
