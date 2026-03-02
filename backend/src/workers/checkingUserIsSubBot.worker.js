import { getBot } from '../bot/index.js'
import { prisma } from '../lib/prisma.js'
import { CHECKING_USER_IS_SUB_BOT, getBoss } from '../queues/index.js'

// Проверяет пользователей не отписались ли от бота
export async function checkingUserIsSubBotWorker() {
	const boss = await getBoss()
	console.log('starting worker...')
	await boss.work(CHECKING_USER_IS_SUB_BOT, async ([job]) => {
		console.log('working on job:', job.id)
		try {
			const bot = getBot()

			const allUsers = await prisma.user.findMany({
				select: { telegramId: true, isSubBot: true }
			})

			for (const user of allUsers) {
				try {
					await bot.telegram.sendChatAction(user.telegramId, 'typing')
					if (!user.isSubBot) {
						await prisma.user.update({
							where: { telegramId: user.telegramId },
							data: { isSubBot: true }
						})
					}
				} catch (error) {
					if (
						error.response?.error_code === 400 ||
						error.response?.error_code === 403
					) {
						//description: description: Bad Request: chat not found
						await prisma.user.update({
							where: { telegramId: user.telegramId },
							data: { isSubBot: false }
						})
						continue
					}
					console.error(
						'[checkingUserIsSubBotWorker sendChatAction] error:',
						error
					)
				}
			}
		} catch (error) {
			console.error('[checkingUserIsSubBotWorker] error:', error)
		}
	})
}
