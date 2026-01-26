import { env } from '../../config/env.js'

// @desc
// @route get /api/
// @access Public
export const getSubscriptionCheck = async (req, res) => {
	try {
		const botToken = env.TG_BOT_TOKEN
		const channelUsername = '@sklyarix'

		const { initData } = req.body
		if (!initData) {
			return res.status(400).json({ error: 'AUTH__MISSING_INITDATA' })
		}

		if (!env.TG_BOT_TOKEN) {
			return res.status(400).send({ error: 'invalid token' })
		}

		// Валидируем initData с помощью токена бота
		const isInitDataValid = isValid(initData, env.TG_BOT_TOKEN)
		// Ошибка, если initData некорректна
		if (!isInitDataValid) {
			return res.status(400).send({ error: 'AUTH__INVALID_INITDATA' })
		}
		// Парсим initData и достаем Telegram ID пользователя
		const user = parse(initData).user
		// Ошибка, tgId
		if (!user) {
			return res.status(400).send({ error: 'AUTH__INVALID_INITDATA' })
		}
		// Проверка на подписки
		const response = await axios.get(
			`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getChatMember`,
			{
				params: {
					chat_id: channelUsername,
					user_id: user.id
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
