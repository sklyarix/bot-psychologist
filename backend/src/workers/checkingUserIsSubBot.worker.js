import { getBot } from '../bot/index.js'
import { CHECKING_USER_IS_SUB_BOT, getBoss } from '../queues/index.js'

// Проверяет пользователей не отписались ли от бота
export async function checkingUserIsSubBotWorker() {
	const boss = await getBoss()
	await boss.work(CHECKING_USER_IS_SUB_BOT, async ([job]) => {
		try {
			const bot = getBot()

			const subUsers = await prisma.user.findMany({
				where: { isSubBot: true },
				select: { telegramId: true }
			})

			for (const user of subUsers) {
				try {
					await bot.telegram.sendChatAction(user.telegramId, 'typing')
				} catch (error) {
					if (error.response?.statusCode === 403) {
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
