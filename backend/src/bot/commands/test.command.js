import { CHECKING_USER_IS_SUB_BOT, getBoss } from '../../queues/index.js'

export async function testCommand(ctx) {
	const boss = await getBoss()
	await boss.send(CHECKING_USER_IS_SUB_BOT, {})

	await ctx.reply('Запустил')
}
