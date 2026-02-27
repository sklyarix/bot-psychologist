import axios from 'axios'
import { env } from '../../config/env.js'

export const getSubscriptionCheck = async (channelUsername, userId) => {
	try {
		if (env.TYPE_DEV == 'dev') {
			return true
		}
		if (!userId) {
			return res.status(500).json({ error: 'internal_error' })
		}
		if (!channelUsername) {
			return res.status(500).json({ error: 'internal_error' })
		}
		// Проверка на подписки
		const response = await axios.get(
			`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getChatMember`,
			{
				params: {
					chat_id: channelUsername,
					user_id: userId
				}
			}
		)
		// Статус подписки пользователя
		const memberStatus = response.data.result.status
		// Проверка статуса пользователя на канале
		if (
			memberStatus === 'member' ||
			memberStatus === 'administrator' ||
			memberStatus === 'creator'
		) {
			// Пользователь подписан
			return true
		} else {
			// Пользователь не подписан
			return false
		}
	} catch (error) {
		console.error('Error checking subscription:', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
