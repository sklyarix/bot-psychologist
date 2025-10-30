import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

export const env = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN,
  WEB_APP: process.env.WEB_APP,
  DATABASE_URL: process.env.DATABASE_URL,
  TIMEWEBGPT_API_KEY: process.env.TIMEWEBGPT_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
};

if (!env.OPENAI_API_KEY) {
  // Явное сообщение в логе, чтобы сразу видеть, что воркер/процесс не видит ключ
  console.warn("[env] OPENAI_API_KEY is empty (check .env and process.cwd())");
}
if (!env.TELEGRAM_BOT_TOKEN) {
  // Явное сообщение в логе, чтобы сразу видеть, что воркер/процесс не видит ключ
  console.warn("[env] OPENAI_API_KEY is empty (check .env and process.cwd())");
}
