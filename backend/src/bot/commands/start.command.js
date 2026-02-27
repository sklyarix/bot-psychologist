import { Markup } from 'telegraf'
import { env } from '../../../config/env.js'
import { getSubscriptionCheck } from '../../helpers/getSubscriptionCheck.js'

export async function startCommand(ctx) {
	// ID канала для проверки подписки
	const channelUsername = env.CHANNEL_USERNAME

	// Проверяем, является ли пользователь подписчиком канала
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

	const keyboard = Markup.inlineKeyboard([
		[
			Markup.button.webApp('Войти в кабинет', env.HOST),

			//Markup.button.url('Войти в кабинет url', 'https://t.me/devpsychologist_bot?startapp'),
			Markup.button.url(
				'Записаться на консультацию',
				'https://ivannasapcho2.tilda.ws/'
			)
		]
	])

	const helloText = `Привет, этот бот — твой психологический помощник, созданный на основе подхода психолога Иванны Сапожниковой.\n\nЕго задача — помогать тебе двигаться к целям осознанно, сохраняя внутреннюю опору, смысл и ощущение свободы в любое время суток.\n\nВ основе — знания современной психологии, экзистенциализма, исследований в области мотивации, устойчивости и саморегуляции.\n\nЗдесь нет готовых советов, но бот поможет увидеть глубже: что для тебя важно, что ограничивает, а что — поддерживает, и какой шаг будет следующим.\n\nПеред использованием ознакомься с Правилами и Возможностями. \n\n<b>/help</b> - Правила\n<b>/info</b> - Возможности`

	await ctx.replyWithHTML(helloText, keyboard)
}
