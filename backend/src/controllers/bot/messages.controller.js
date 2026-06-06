import { prisma } from '../../lib/prisma.js'
import { EmailService } from '../../services/email.service.js'

// @desc Отправить сообщение по почте пользователю
// @route POST /api/bot/message
// @access Public (add `auth` middleware if needed)
export const enqueueBotMessage = async (req, res) => {
	try {
		const { userId, message, inlineKeyboard } = req.body

		if (!userId || !message) {
			return res.status(400).json({ error: 'userId and message required' })
		}

		// Если userId === 'all_active', отправляем всем пользователям
		if (userId === 'all_active') {
			const allUsers = await prisma.user.findMany({
				select: { id: true, email: true }
			})

			for (const user of allUsers) {
				if (!user.email) continue
				await EmailService.sendMessageToUser({
					email: user.email,
					message,
					inlineButtons: inlineKeyboard
				})
			}
		} else {
			// Получить пользователя по ID и отправить сообщение
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { email: true }
			})

			if (!user || !user.email) {
				return res.status(404).json({ error: 'user_not_found_or_no_email' })
			}

			await EmailService.sendMessageToUser({
				email: user.email,
				message,
				inlineButtons: inlineKeyboard
			})
		}

		return res.json({ success: true })
	} catch (error) {
		console.error('enqueueBotMessage error =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}

// @desc Добавить задачу отправки видео-сообщения в очередь
// @route POST /api/bot/message/video
// @access Public
export const enqueueBotMessageVideo = async (req, res) => {
	try {
		const { telegramId } = req.body
		if (!telegramId) {
			return res.status(400).json({ error: 'telegramId required' })
		}

		const boss = await getBoss()
		await boss.send(BOT_MESSAGE_VIDEO_QUEUE, { telegramId })

		return res.json({ success: true })
	} catch (error) {
		console.error('enqueueBotMessageVideo error =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
