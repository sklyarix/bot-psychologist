import { env } from "../../config/env.js";
import { getBot } from "../bot/index.js";
import { BOT_MESSAGE_QUEUE, getBoss } from "../queues/index.js";

export async function sendMessageWorker() {
  const boss = await getBoss();
  await boss.work(BOT_MESSAGE_QUEUE, async ([job]) => {
    const { telegramId, message } = job.data;

    try {
      const bot = getBot();
      await bot.telegram.sendMessage(telegramId, message);
    } catch (e) {
      console.error("[sendMessageWorker] sendMessage error:", e);
    }
  });
}
