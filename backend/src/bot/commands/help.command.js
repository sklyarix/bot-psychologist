import { Markup } from 'telegraf'
import { prisma } from '../../lib/prisma.js'

export async function helpCommand(ctx) {
	const commandData = await prisma.botCommand.findUnique({
		where: { command: 'help' }
	})

	if (!commandData) {
		await ctx.reply('Команда help не найдена в базе данных.')
		return
	}

	const { textHTML, keyboard: keyboardData } = commandData.content

	let keyboard
	if (keyboardData && keyboardData.length > 0) {
		keyboard = Markup.inlineKeyboard(
			keyboardData.map(row =>
				row
					.map(btn => {
						if (btn.type === 'callback') {
							return Markup.button.callback(btn.text, btn.data)
						} else if (btn.type === 'webApp') {
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
