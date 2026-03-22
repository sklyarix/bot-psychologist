import { listMessageNotifyAiGoal } from '../config/listMessageNotifyAiGoal.js'
import { prisma } from '../lib/prisma.js'
import { splitPlanByDays } from '../helpers/splitPlanByDays.js'
import { AI_GOAL_QUEUE, BOT_MESSAGE_QUEUE, getBoss } from '../queues/index.js'
import { AIService } from '../services/ai.service.js'
import { updateAiGoalStatus } from '../services/updateAiGoalStatus.service.js'

const ai = new AIService()

export async function aiGoalWorker() {
	const boss = await getBoss()
	await boss.work(AI_GOAL_QUEUE, { teamSize: 1 }, async ([job]) => {
		const { goalId, telegramId, title } = job.data
		try {
			updateAiGoalStatus(goalId, 'Старт', 'active')
			// Генерируем текст отправляем промт
			const resultAi = await ai.sendTimewebGPT({
				presetKey: 'goal',
				text: title
			})
			// TODO: Исправить логику ошибок
			if (!resultAi) {
				updateAiGoalStatus(
					goalId,
					'Технические неполадки. Скоро исправим.',
					'failed'
				)
			}
			// Разбили на дни ответ ИИ
			const objectDays = splitPlanByDays(resultAi)
			// Если не шаблонизировался ответ
			if (objectDays.length === 0) {
				updateAiGoalStatus(
					goalId,
					'Так не сработает. Напишите корректную цель',
					'completed'
				)
			}
			// Формируем уведомления
			for (let day = 1; day <= diffDays; day++) {
				// Сообщение
				const messageData = await prisma.aiGoalMessage.findUnique({
					where: { day }
				})
				const message = messageData?.message || `День ${day}\nСообщение не найдено.`
				// Получаем текущее время в миллисекундах
				const nowTime = Date.now()
				const at9Time = new Date(nowTime).setHours(9, 0, 0, 0)
				// Дата отправления
				const startAfter =
					day === 1
						? new Date(nowTime)
						: new Date(at9Time + (day - 1) * 24 * 60 * 60 * 1000)

				// Кнопки
				let inlineKeyboard = []
				if (day === 3) {
					inlineKeyboard = [
						[
							{
								text: 'Задать вопрос Иванне',
								url: 'https://t.me/ivannasapcho'
							}
						]
					]
				} else if (day === diffDays) {
					inlineKeyboard = [
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
				}
				// В очередь
				await boss.send(
					BOT_MESSAGE_QUEUE,
					{ telegramId, message, inlineKeyboard },
					{
						startAfter,
						retryLimit: 3,
						retryDelay: 60
					}
				)
			}
			updateAiGoalStatus(goalId, objectDays, 'completed')
		} catch (e) {
			console.error('aiGoalWorker error:', e)
			updateAiGoalStatus(goalId, 'Ошибка при генерации текста', 'failed')
		}
	})
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
