import type { UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PageResponse, PagesResponse } from '../../../api/pages.tsx'
import { pagesApi } from '../../../api/pages.tsx'

export function useGetAllPages(): UseQueryResult<PagesResponse, unknown> {
	return useQuery({
		queryKey: ['cms', 'pages'],
		queryFn: () => pagesApi.getAll()
	})
}

export function useGetPageById(
	id: string | null
): UseQueryResult<PageResponse | null, unknown> {
	return useQuery({
		queryKey: ['cms', 'pages', id],
		queryFn: () => (id ? pagesApi.getById(id) : Promise.resolve(null)),
		enabled: !!id
	})
}

export function useCreatePage() {
	const qc = useQueryClient()
	return useMutation<PageResponse, unknown, { title: string; slug: string }>({
		mutationFn: (payload: { title: string; slug: string }) =>
			pagesApi.create(payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'pages'] })
	})
}

export function useUpdatePage() {
	const qc = useQueryClient()
	return useMutation<
		PageResponse,
		unknown,
		{ id: string; payload: { title?: string; slug?: string } }
	>({
		mutationFn: ({
			id,
			payload
		}: {
			id: string
			payload: { title?: string; slug?: string }
		}) => pagesApi.update(id, payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'pages'] })
	})
}

export function useDeletePage() {
	const qc = useQueryClient()
	return useMutation<{ success: boolean }, unknown, string>({
		mutationFn: (id: string) => pagesApi.remove(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'pages'] })
	})
}
