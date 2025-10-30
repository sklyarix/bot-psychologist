import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../../../api/ai.tsx';

export function useGetAllGoal() {
  return useQuery({
    queryKey: ['ai', 'getAll', 'goal'],
    queryFn: () => aiApi.getAllAiGoal(),
    retry: true,
  });
}
