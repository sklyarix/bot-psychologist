import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { pagesApi, type PageResponse, type PagesResponse } from '../../../api/pages.tsx';

export function useGetAllPages(): UseQueryResult<PagesResponse, unknown> {
  return useQuery({
    queryKey: ['cms', 'pages'],
    queryFn: () => pagesApi.getAll(),
  });
}

export function useGetPageById(id: string | null): UseQueryResult<PageResponse | null, unknown> {
  return useQuery({
    queryKey: ['cms', 'pages', id],
    queryFn: () => (id ? pagesApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}
