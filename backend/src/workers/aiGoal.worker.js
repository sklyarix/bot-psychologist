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
				/*
        const target = new Date(now);
        target.setDate(target.getDate() + i);
         */
				let message
				switch (day) {
					case 1:
						message = `Твой первый шаг открыт.\nСкорее действуй!`
						break
					case 2:
						message = `Следующий шаг уже ждёт тебя.\nЧто из вчерашнего вызвало сопротивление? Обрати на это внимание.`
						break
					case 3:
						message = `Привет, это Иванна.\n\nМне интересно, как сейчас проходит твоё исследование. Появляются ли новые вопросы или сомнения? Если да — это хороший знак.\n\nПоиск ориентиров редко бывает простым. Часто именно в этой точке хочется чуть больше ясности и опоры.\n\nЕсли чувствуешь, что тебе нужна помощь, ты можешь задать мне любой вопрос по кнопке ниже — я отвечу и помогу разобраться.`
						break
					case 4:
						message = `Можно двигаться дальше, но сначала подумай, что сейчас поддерживает тебя больше всего — и как ты это используешь?`
						break
					case 5:
						message = `Следующий шаг доступен.\nКакое небольшое, но важное изменение ты уже чувствуешь?`
						break
					case 6:
						message = `Ты близко к финалу и началу нового пути.\nЧто стало для тебя яснее за эти дни?`
						break
					case 7:
						message = `Поздравляю, исследование ориентиров завершено и одновременно только начинается.\n\nК этому моменту обычно становится яснее: что действительно важно, где есть напряжение, и что хочется прояснить глубже, не в одиночку.\n\nЕсли ты чувствуешь, что хочешь разобрать свою ситуацию точнее и быстрее, я могу поддержать тебя в личной консультации.\n\n2900 ₽ (обычная цена — 4000 ₽).\n\nМожешь записаться по кнопке ниже. Если не время сейчас, ты можешь возвращаться к исследованию и идти в своём темпе.`
						break
				}

				const text = encodeURIComponent(
					'Привет! Хочу записаться на консультацию. Удобно ли сегодня?'
				)
				const url = encodeURIComponent('https://t.me/ivannasapcho')

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
										url: `https://t.me/share/url?url=${url}&text=${text}`
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
										text: 'Записаться на консультацию',
										url: `https://t.me/share/url?url=${url}&text=${text}`
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
