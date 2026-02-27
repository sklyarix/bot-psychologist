import { instance } from '../helpers/instance'

export const botApi = {
	// Отправляет текстовое сообщение на бэкенд, который добавит задачу в очередь
	sendMessage: async (payload: {
		telegramId: string
		message: string
		inlineKeyboard?: Array<Array<{ text: string; url: string }>>
	}) => {
		const { data } = await instance.post('/bot/message', payload)
		return data
	}
}
