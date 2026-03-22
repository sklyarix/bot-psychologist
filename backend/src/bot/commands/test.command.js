import { prisma } from '../../lib/prisma.js'
import { getBoss } from '../../queues/index.js'

export async function testCommand(ctx) {
	const boss = await getBoss()
	//await boss.send(CHECKING_USER_IS_SUB_BOT, {})
	await prisma.botCommand.deleteMany({})
	await ctx.reply('Очистил команды')
}
