import { Telegraf } from 'telegraf'
import { env } from '../../config/env.js'
import { helpCommand } from './commands/help.command.js'
import { infoCommand } from './commands/info.command.js'
import { startCommand } from './commands/start.command.js'
import { testCommand } from './commands/test.command.js'

const token =
	env.TYPE_DEV == 'dev' ? `${env.TG_BOT_TOKEN}/test` : `${env.TG_BOT_TOKEN}`
let bot = null

export function initBot() {
	bot = new Telegraf(token)
	bot.start(ctx => startCommand(ctx))
	bot.command('test', ctx => testCommand(ctx))
	bot.command('help', ctx => helpCommand(ctx))
	bot.command('info', ctx => infoCommand(ctx))

	bot.action('info', ctx => infoCommand(ctx))
	bot.action('start', ctx => startCommand(ctx))
	bot.action('test', ctx => testCommand(ctx))

	bot.launch().then(() => console.log('Bot launched (polling)'))

	return bot
}
export function getBot() {
	if (!bot) throw new Error('Bot is not initialized. Call initBot() first.')
	return bot
}
