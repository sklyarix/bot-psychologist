import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../../../api/ai.tsx';

export function useGetAllQA() {
  return useQuery({
    queryKey: ['ai', 'getAll', 'QA'],
    queryFn: () => aiApi.getAllAiQA(),
    retry: true,
  });
}
