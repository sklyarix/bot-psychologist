import { instance } from '../helpers/instance'

export interface BotCommand {
	id: string
	command: string
	content: {
		textHTML?: string
		keyboard?: Array<
			Array<{
				type: 'callback' | 'webApp' | 'url'
				text: string
				data?: string
				url?: string
			}>
		>
		notSubscribedText?: string
		notSubscribedKeyboard?: Array<
			Array<{
				type: 'url' | 'callback'
				text: string
				data?: string
				url?: string
			}>
		>
	}
	createdAt: string
	updatedAt: string
}

export const botCommandsApi = {
	getAll: async (): Promise<BotCommand[]> => {
		const { data } = await instance.get('/bot-commands')
		return data
	},

	create: async (payload: {
		command: string
		content: unknown
	}): Promise<BotCommand> => {
		const { data } = await instance.post('/bot-commands', payload)
		return data
	},

	update: async (
		id: string,
		payload: { command?: string; content?: unknown }
	): Promise<BotCommand> => {
		const { data } = await instance.put(`/bot-commands/${id}`, payload)
		return data
	}
}

export const botApi = {
	sendMessage: async (payload: { userId: string; message: string }) => {
		const { data } = await instance.post('/bot/message', payload)
		return data
	}
}
