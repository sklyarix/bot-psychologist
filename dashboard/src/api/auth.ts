import { instance } from '../helpers/instance'

export type AuthUser = {
	id: string
	email: string
	role: 'user' | 'admin'
}

export type LoginResponse = {
	user: AuthUser
	token: string
}

export const authApi = {
	login: async (email: string, password: string): Promise<LoginResponse> => {
		const { data } = await instance.post('/auth/login', { email, password })
		return data
	},

	register: async (email: string, password: string): Promise<LoginResponse> => {
		const { data } = await instance.post('/auth/register', { email, password })
		return data
	},

	me: async (): Promise<AuthUser> => {
		const { data } = await instance.get('/auth/me')
		return data
	}
}
