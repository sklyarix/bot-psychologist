import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

export const env = {
	HOST: process.env.HOST,
	PORT: process.env.PORT,
	TYPE_DEV: process.env.TYPE_DEV,
	JWT_SECRET: process.env.JWT_SECRET,
	WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN,
	DATABASE_URL: process.env.DATABASE_URL,
	TIMEWEB_API_KEY: process.env.TIMEWEB_API_KEY,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	CHANNEL_USERNAME: process.env.CHANNEL_USERNAME,
	TG_BOT_TOKEN:
		process.env.TYPE_DEV == 'dev'
			? process.env.TG_BOT_TOKEN_DEV
			: process.env.TG_BOT_TOKEN_PROD,
	TIMEWEB_TOKEN: process.env.TIMEWEB_TOKEN,
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASS: process.env.SMTP_PASS,
	SMTP_FROM: process.env.SMTP_FROM
}

if (!env.OPENAI_API_KEY) {
	// Явное сообщение в логе, чтобы сразу видеть, что воркер/процесс не видит ключ
	console.warn('[env] OPENAI_API_KEY is empty (check .env and process.cwd())')
}
if (!env.TG_BOT_TOKEN) {
	// Явное сообщение в логе, чтобы сразу видеть, что воркер/процесс не видит ключ
	console.warn('[env] OPENAI_API_KEY is empty (check .env and process.cwd())')
}
