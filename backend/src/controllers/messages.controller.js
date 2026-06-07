import { prisma } from '../../lib/prisma.js'
import { EmailService } from '../../services/email.service.js'

// @desc Отправить сообщение на e-mail пользователю
// @route POST /api/bot/message
// @access Public
export const enqueueBotMessage = async (req, res) => {
	try {
		const { userId, message } = req.body

		if (!userId || !message) {
			return res.status(400).json({ error: 'userId and message required' })
		}

		if (userId === 'all_active') {
			const allUsers = await prisma.user.findMany({
				select: { id: true, email: true }
			})

			let sent = 0
			let failed = 0

			for (const user of allUsers) {
				if (!user.email) {
					failed++
					continue
				}
				const ok = await EmailService.sendMessageToUser({
					email: user.email,
					message
				})
				ok ? sent++ : failed++
			}

			return res.json({ success: true, sent, failed })
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true }
		})

		if (!user || !user.email) {
			return res.status(404).json({ error: 'user_not_found_or_no_email' })
		}

		const ok = await EmailService.sendMessageToUser({
			email: user.email,
			message
		})

		if (!ok) {
			return res.status(500).json({ error: 'email_send_failed' })
		}

		return res.json({ success: true })
	} catch (error) {
		console.error('enqueueBotMessage error =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}

// @desc Видео через Telegram — отключено
// @route POST /api/bot/message/video
export const enqueueBotMessageVideo = async (_req, res) => {
	return res.status(501).json({ error: 'not_supported' })
}
