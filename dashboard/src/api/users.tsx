import { instance } from '../helpers/instance.tsx'

export type User = {
	id: string
	telegramId: string
	username?: string
	firstName: string
	lastName?: string
	photoUrl?: string
	language: string
	isPremium: boolean
	lastActive: string
	createdAt: string
	updatedAt: string
}

export const usersApi = {
	getAll: async () => {
		const { data } = await instance.get('/users')
		return data
	}
}
