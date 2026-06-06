import { instance } from '../helpers/instance.tsx'

export type User = {
	id: string
	email: string
	password: string
	createdAt: string
	updatedAt: string
}

export const usersApi = {
	getAll: async () => {
		const { data } = await instance.get('/users')
		return data
	},
	getAllSubTrue: async () => {
		const { data } = await instance.get('/users?isSubBot=true')
		return data
	},
	getAllSubFalse: async () => {
		const { data } = await instance.get('/users?isSubBot=false')
		return data
	}
}
