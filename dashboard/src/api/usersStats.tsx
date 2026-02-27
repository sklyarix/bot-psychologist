import { instance } from '../helpers/instance'

export type AiGoal = {
	id: string
	title: string
	status: string
	createdAt: string
	finishedAt?: string | null
}

export type AiQA = {
	id: string
	question: string
	answer?: string | null
	status: string
	createdAt: string
}

export type UserStats = {
	success: boolean
	aiGoals: AiGoal[]
	aiQAs: AiQA[]
	visitsPerDay: number[]
	visitsDates: string[]
	totalVisitsLast30: number
}

export const usersStatsApi = {
	getById: async (id: string): Promise<UserStats> => {
		const { data } = await instance.get(`/users/${id}/stats`)
		return data as UserStats
	}
}
