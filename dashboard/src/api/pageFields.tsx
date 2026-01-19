import { instance } from '../helpers/instance.tsx'
import type { PageField } from './pages'

export type PageFieldResponse = PageField
export type PageFieldsResponse = PageField[]

export const pageFieldsApi = {
	getAll: async (): Promise<PageFieldsResponse> => {
		const { data } = await instance.get('/cms/page-fields')
		return data
	},
	getById: async (id: string): Promise<PageFieldResponse> => {
		const { data } = await instance.get(`/cms/page-fields/${id}`)
		return data
	},
	create: async (payload: {
		pageId: string
		pageGroupId?: string | null
		name: string
		html: string
		displayOrder?: number
	}): Promise<PageFieldResponse> => {
		const { data } = await instance.post('/cms/page-fields', payload)
		return data
	},
	update: async (
		id: string,
		payload: {
			pageId?: string
			pageGroupId?: string | null
			name?: string
			html?: string
			displayOrder?: number
		}
	): Promise<PageFieldResponse> => {
		const { data } = await instance.put(`/cms/page-fields/${id}`, payload)
		return data
	},
	remove: async (id: string): Promise<{ success: boolean }> => {
		const { data } = await instance.delete(`/cms/page-fields/${id}`)
		return data
	}
}
