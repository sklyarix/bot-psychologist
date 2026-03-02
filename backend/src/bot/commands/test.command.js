import { CHECKING_USER_IS_SUB_BOT } from '../../queues/index'

export async function testCommand(ctx) {
	await b.send(CHECKING_USER_IS_SUB_BOT, {})

	await ctx.reply('Запустил')
}
