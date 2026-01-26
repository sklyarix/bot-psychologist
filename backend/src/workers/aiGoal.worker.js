import { splitPlanByDays } from '../helpers/splitPlanByDays.js'
import { prisma } from '../lib/prisma.js'
import { AI_GOAL_QUEUE, BOT_MESSAGE_QUEUE, getBoss } from '../queues/index.js'
import { AIService } from '../services/ai.service.js'

const ai = new AIService()

export async function aiGoalWorker() {
	const boss = await getBoss()
	await boss.work(AI_GOAL_QUEUE, { teamSize: 1 }, async ([job]) => {
		//console.log('[ai-goal worker] got job:', job.id, job.data)

		const { goalId, telegramId, title } = job.data

		// Обновили статусы
		await prisma.$transaction(async tx => {
			await tx.aiGoal.update({
				where: { id: goalId },
				data: { status: 'active' }
			})
		})

		// Даты для целей
		const now = new Date()
		const at9 = new Date(now)
		at9.setHours(9, 0, 0, 0)

		const finishedAt = new Date(at9.getTime() + 7 * 24 * 60 * 60 * 1000)
		try {
			const resultAi = await ai.sendTimewebGPT({
				presetKey: 'goal',
				text: title
			})

			//console.log('resultAi:', resultAi)

			// ПРОВЕРКА: ответ от timeweb
			if (!resultAi) {
				// Обновляем данные и статусы
				return prisma.$transaction(async tx => {
					await tx.aiGoal.update({
						where: { id: goalId },
						data: {
							description: 'Технические неполадки. Скоро исправим.',
							status: 'completed',
							finishedAt
						}
					})
				})
			}

			//console.log('[ai-goal worker] resultAi:', resultAi)

			const objectDays = splitPlanByDays(resultAi)
			//console.log('[ai-goal worker] objectDays:', objectDays)

			// ПРОВЕРКА: корректный ли запрос пользователя
			if (objectDays.length === 0) {
				// Обновляем данные и статусы
				return prisma.$transaction(async tx => {
					await tx.aiGoal.update({
						where: { id: goalId },
						data: {
							description: 'Так не сработает. Напишите корректную цель',
							status: 'completed',
							finishedAt
						}
					})
				})
			}
			// Обновляем данные и статусы
			await prisma.$transaction(async tx => {
				await tx.aiGoal.update({
					where: { id: goalId },
					data: {
						description: objectDays,
						status: 'completed',
						finishedAt
					}
				})
			})

			// Ставим уведомления
			const diffDays = 7
			for (let day = 1; day <= diffDays; day++) {
				let message
				switch (day) {
					case 1:
						message = `День 1\nДа начнется исследование! Каждый шаг будет открываться в 9:00 утра. Приготовь заметки или тетрадь для ответов на вопросы и двигайся шаг за шагом ⚡️`
						break
					case 2:
						message = `День 2\nВторой шаг уже ждёт тебя.\nЧто из вчерашнего вызвало сопротивление?`
						break
					case 3:
						message = `День 3\nПривет, это Иванна👋🏻\n\nМне интересно, как сейчас проходит твоё исследование. Появляются ли новые вопросы или сомнения? Если да — это хороший знак.\n\nПоиск ориентиров редко бывает простым. Если чувствуешь, что тебе нужна помощь, ты можешь задать мне любой вопрос по кнопке ниже — я отвечу и помогу разобраться.`
						break
					case 4:
						message = `День 4\nМожно двигаться дальше, но сначала подумай: что сейчас поддерживает тебя больше всего? Люди, привычки, убеждения? Что для тебя является опорой?`
						break
					case 5:
						message = `День 5\nСледующий шаг доступен.\nКакое небольшое изменение ты уже чувствуешь`
						break
					case 6:
						message = `День 6\nТы близко к финалу и началу нового пути.\nЧто стало для тебя яснее за эти дни?`
						break
					case 7:
						message = `День 7\nПоздравляю, исследование ориентиров завершено и одновременно только начинается.\n\nК этому моменту что-то становится яснее, а какие-то вопросы наоборот занимают ум. Уже чувствуешь, где есть напряжение, и что хочется прояснить не в одиночку \n\nЯ провожу консультации, на которых ты можешь решить вопросы, связанные с тревогой, страхами, кризисами смысла и отношениями с самим собой.\n\nСтоимость: 2500₽\n\nЕсть социальные места, для тех, кому особенно сложно, стоимость: 1000₽\n\nМожешь рассказать о своей проблеме по кнопке ниже. Если не время сейчас, ты можешь возвращаться к исследованию и идти в своём темпе, я буду на связи.`
						break
				}

				// начисляем день
				const startAfter =
					day != 1
						? new Date(at9.getTime() + (day - 1) * 24 * 60 * 60 * 1000)
						: now

				//console.log(day, 'Date =', startAfter.getTime())

				if (day === 3) {
					await boss.send(
						BOT_MESSAGE_QUEUE,
						{
							telegramId,
							message,
							inlineKeyboard: [
								[
									{
										text: 'Задать вопрос Иванне',
										url: 'https://t.me/ivannasapcho'
									}
								]
							]
						},
						{
							startAfter: startAfter,
							retryLimit: 3,
							retryDelay: 60
						}
					)
				} else if (day === diffDays) {
					await boss.send(
						BOT_MESSAGE_QUEUE,
						{
							telegramId,
							message,
							inlineKeyboard: [
								[
									{
										text: 'Связаться с Иванной',
										url: 'https://t.me/ivannasapcho'
									},
									{
										text: 'Подробнее о терапии',
										url: 'https://ivpsycho.ru/'
									}
								]
							]
						},
						{
							startAfter: startAfter,
							retryLimit: 3,
							retryDelay: 60
						}
					)
				} else {
					await boss.send(
						BOT_MESSAGE_QUEUE,
						{ telegramId, message },
						{
							startAfter: startAfter,
							retryLimit: 3,
							retryDelay: 60
						}
					)
				}

				/* Видео в последний день */
				/* Временно отключено */
				/*
        if (i === diffDays) {
          await boss.send(
            BOT_MESSAGE_VIDEO_QUEUE,
            { telegramId },
            {
              startAfter: new Date(now.getTime() + 60 * 1000),
              retryLimit: 3,
              retryDelay: 60,
            },
          );
        }
        */
			}
		} catch (e) {
			console.error('aiGoalWorker error:', e)
			await prisma.aiGoal.update({
				where: { id: goalId },
				data: { status: 'failed' }
			})
		}
	})
}
