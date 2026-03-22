import { Markup } from 'telegraf'
import { env } from '../../../config/env.js'
import { prisma } from '../../lib/prisma.js'

export async function startCommand(ctx) {
	// ID канала для проверки подписки
	const channelUsername = env.CHANNEL_USERNAME

	// Проверяем, является ли пользователь подписчиком канала

	// Временно убираем (блокировки)

	/*
	const isSub = await getSubscriptionCheck(env.CHANNEL_USERNAME, ctx.from.id)

	if (!isSub) {
		const keyboard = Markup.inlineKeyboard([
			[
				Markup.button.url(
					'Подписаться на канал',
					`https://t.me/${channelUsername.slice(1)}`
				),
				Markup.button.callback('Подписался', 'start')
			]
		])
		const textIsCheckSub = `Привет! Добро пожаловать в бот, который поможет тебе в саморефлексии. Для того, чтобы продолжить, нужно подписаться на канал Иванны «Экзистенция на полке».\n\nПосле этого отправь команду для продолжения!`
		await ctx.replyWithHTML(textIsCheckSub, keyboard)
		return
	}
	*/

	const commandData = await prisma.botCommand.findUnique({
		where: { command: 'start' }
	})

	if (!commandData) {
		await ctx.reply('Команда start не найдена в базе данных.')
		return
	}

	const { textHTML, keyboard: keyboardData } = commandData.content

	let keyboard
	if (keyboardData && keyboardData.length > 0) {
		keyboard = Markup.inlineKeyboard(
			keyboardData.map(row =>
				row
					.map(btn => {
						if (btn.type === 'webApp') {
							return Markup.button.webApp(btn.text, btn.url)
						} else if (btn.type === 'url') {
							return Markup.button.url(btn.text, btn.url)
						}
						return null
					})
					.filter(Boolean)
			)
		)
	}

	await ctx.replyWithHTML(
		textHTML,
		keyboard ? { reply_markup: keyboard.reply_markup } : {}
	)
}
