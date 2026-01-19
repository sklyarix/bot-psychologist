import { instance } from '../helpers/instance.tsx'
import type { PageFieldGroup } from './pages'

export type PageFieldGroupResponse = {
	success: boolean
	pageFieldGroup: PageFieldGroup
}
export type PageFieldGroupsResponse = {
	success: boolean
	pageFieldGroups: PageFieldGroup[]
}

export const pageFieldGroupsApi = {
	getAll: async (): Promise<PageFieldGroupsResponse> => {
		const { data } = await instance.get('/cms/page-field-groups')
		return data
	},
	getById: async (id: string): Promise<PageFieldGroupResponse> => {
		const { data } = await instance.get(`/cms/page-field-groups/${id}`)
		return data
	},
	create: async (payload: {
		pageId: string
		name: string
		title?: string | null
		displayOrder?: number
	}): Promise<PageFieldGroupResponse> => {
		const { data } = await instance.post('/cms/page-field-groups', payload)
		return data
	},
	update: async (
		id: string,
		payload: { name?: string; title?: string | null; displayOrder?: number }
	): Promise<PageFieldGroupResponse> => {
		const { data } = await instance.put(`/cms/page-field-groups/${id}`, payload)
		return data
	},
	remove: async (id: string): Promise<{ success: boolean }> => {
		const { data } = await instance.delete(`/cms/page-field-groups/${id}`)
		return data
	}
}
