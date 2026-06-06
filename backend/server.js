import express from 'express'

import cors from 'cors'
import { env } from './config/env.js'
import { startQueues, stopBoss } from './src/queues/index.js'
import index from './src/routes/index.js'
import { aiGoalWorker } from './src/workers/aiGoal.worker.js'
import { aiQuestionAnswerWorker } from './src/workers/aiQuestionAnswer.worker.js'
import { checkingUserIsSubBotWorker } from './src/workers/checkingUserIsSubBot.worker.js'
import {
	sendMessageVideoWorker,
	sendMessageWorker
} from './src/workers/sendMessage.worker.js'

const app = express()
//let bot
let httpServer

const init = async () => {
	app.use(cors())
	app.use(express.json())
	app.use('/api', index)

	//bot = initBot()

	// очереди
	await startQueues()

	// воркеры
	await aiGoalWorker()
	await sendMessageWorker()
	await sendMessageVideoWorker()
	await aiQuestionAnswerWorker()
	await checkingUserIsSubBotWorker()

	httpServer = app.listen(env.PORT, () => {
		console.log(`Сервер запущен на :${env.PORT}`)
	})

	// аккуратное завершение
	process.on('SIGINT', stop)
	process.on('SIGTERM', stop)
}

async function stop() {
	try {
		console.log('Graceful shutdown...')
		// 1) останавливаем Telegraf
		if (bot) await bot.stop('SIGTERM')

		// 2) останавливаем PgBoss (воркеры)
		await stopBoss()

		// 3) закрываем HTTP-сервер
		if (httpServer) {
			await new Promise(resolve => httpServer.close(resolve))
		}
	} catch (e) {
		console.error('Shutdown error:', e)
	} finally {
		process.exit(0)
	}
}

init()
	.then(async () => {})
	.catch(async e => {
		console.error(e)
		process.exit(1)
	})
