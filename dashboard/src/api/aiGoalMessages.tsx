import { instance } from '../helpers/instance'

export interface AiGoalMessage {
	id: string
	day: number
	message: string
	createdAt: string
	updatedAt: string
}

export const aiGoalMessagesApi = {
	getAll: async (): Promise<AiGoalMessage[]> => {
		const { data } = await instance.get('/ai-goal-messages')
		return data
	},

	create: async (payload: {
		day: number
		message: string
	}): Promise<AiGoalMessage> => {
		const { data } = await instance.post('/ai-goal-messages', payload)
		return data
	},

	update: async (
		id: string,
		payload: { day?: number; message?: string }
	): Promise<AiGoalMessage> => {
		const { data } = await instance.put(`/ai-goal-messages/${id}`, payload)
		return data
	},

	delete: async (id: string): Promise<void> => {
		await instance.delete(`/ai-goal-messages/${id}`)
	}
}
