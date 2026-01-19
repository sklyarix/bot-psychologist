import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../../api/stats.tsx';

const VISIT_KEY = 'web_visit_logged';

export function useVisit() {
  const isLogged = typeof window !== 'undefined' && sessionStorage.getItem(VISIT_KEY) === '1';

  return useQuery({
    queryKey: ['stats', 'visit'],
    enabled: !isLogged,
    retry: true,
    staleTime: Infinity,
    queryFn: async () => {
      const res = await statsApi.visit();
      sessionStorage.setItem(VISIT_KEY, '1');
      return res;
    },
  });
}
