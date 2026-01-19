import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageFieldGroupsApi } from '../../../api/pageFieldGroups'
import type { PageFieldGroup } from '../../../api/pages'

export function useGetAllPageFieldGroups() {
	return useQuery({
		queryKey: ['cms', 'page-field-groups'],
		queryFn: () => pageFieldGroupsApi.getAll()
	})
}

export function useCreatePageFieldGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (payload: {
			pageId: string
			name: string
			title?: string | null
			displayOrder?: number
		}) => pageFieldGroupsApi.create(payload),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ['cms', 'page-field-groups'] })
	})
}

export function useUpdatePageFieldGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({
			id,
			payload
		}: {
			id: string
			payload: Partial<PageFieldGroup>
		}) => pageFieldGroupsApi.update(id, payload as any),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ['cms', 'page-field-groups'] })
	})
}

export function useDeletePageFieldGroup() {
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => pageFieldGroupsApi.remove(id),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ['cms', 'page-field-groups'] })
	})
}
