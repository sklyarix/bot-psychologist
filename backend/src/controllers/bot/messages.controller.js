import {
	BOT_MESSAGE_QUEUE,
	BOT_MESSAGE_VIDEO_QUEUE,
	getBoss
} from '../../queues/index.js'

// @desc Добавить задачу отправки текстового сообщения в очередь
// @route POST /api/bot/message
// @access Public (add `auth` middleware if needed)
export const enqueueBotMessage = async (req, res) => {
	try {
		const { telegramId, message, inlineKeyboard } = req.body

		if (!telegramId || !message) {
			return res.status(400).json({ error: 'telegramId and message required' })
		}

		const boss = await getBoss()
		// Добавляем задачу в очередь для воркера sendMessageWorker
		await boss.send(BOT_MESSAGE_QUEUE, { telegramId, message, inlineKeyboard })

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
