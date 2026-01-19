import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageFieldsApi } from '../../../api/pageFields'
import type { PageField } from '../../../api/pages'

export function useGetAllPageFields() {
	return useQuery<PageField[]>({
		queryKey: ['cms', 'page-fields'],
		queryFn: () => pageFieldsApi.getAll()
	})
}

export function useCreatePageField() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: {
			pageId: string
			pageGroupId?: string | null
			title: string
			name: string
			html: string
			displayOrder?: number
		}) => pageFieldsApi.create(payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'page-fields'] })
	})
}

export function useUpdatePageField() {
	const qc = useQueryClient()
	return useMutation({
		mutationKey: ['cms', 'update', 'page-field'],
		mutationFn: ({
			id,
			payload
		}: {
			id: string
			payload: {
				pageId?: string
				pageGroupId?: string | null
				name?: string
				title?: string
				html?: string
				displayOrder?: number
			}
		}) => pageFieldsApi.update(id, payload),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'pages'] })
	})
}

export function useDeletePageField() {
	const qc = useQueryClient()
	return useMutation<{ success: boolean }, unknown, string>({
		mutationFn: id => pageFieldsApi.remove(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cms', 'page-fields'] })
	})
}
