import PgBoss from 'pg-boss'
import { env } from '../../config/env.js'

let boss = null

export async function getBoss() {
	if (!boss) {
		boss = new PgBoss(env.DATABASE_URL)
		boss.on('error', err => console.error('[pg-boss error]', err))
		await boss.start()
	}
	return boss
}

export async function stopBoss() {
	if (boss) await boss.stop()
}

/* Имена очередей */
export const AI_GOAL_QUEUE = 'ai-goal'
export const AI_QA_QUEUE = 'ai-qa'
export const BOT_MESSAGE_QUEUE = 'bot-message'
export const BOT_MESSAGE_VIDEO_QUEUE = 'bot-message-video'
export const CHECKING_USER_IS_SUB_BOT = 'checking-user-is-sub-bot'

// Явно создаём очереди один раз при старте
export async function startQueues() {
	const b = await getBoss()
	await Promise.all([
		b.createQueue(BOT_MESSAGE_VIDEO_QUEUE),
		b.createQueue(BOT_MESSAGE_QUEUE),
		b.createQueue(AI_QA_QUEUE),
		b.createQueue(AI_GOAL_QUEUE),
		b.createQueue(CHECKING_USER_IS_SUB_BOT)
	])
	// Запускать каждый день в 03:00
	await b.schedule(CHECKING_USER_IS_SUB_BOT, '0 3 * * 7')
}
