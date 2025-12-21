import path from "path";
import { fileURLToPath } from "url";
import { getBot } from "../bot/index.js";
import {
  BOT_MESSAGE_QUEUE,
  BOT_MESSAGE_VIDEO_QUEUE,
  getBoss,
} from "../queues/index.js";

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

export async function sendMessageVideoWorker() {
  const boss = await getBoss();
  await boss.work(BOT_MESSAGE_VIDEO_QUEUE, async ([job]) => {
    const { telegramId } = job.data;
    // video_path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const videoPath = path.join(
      __dirname,
      "..",
      "..",
      "assets",
      "video",
      "video-test.mp4",
    );
    const bot = getBot();
    try {
      await bot.telegram.sendVideoNote(telegramId, {
        source: videoPath,
      });
    } catch (e) {
      await bot.telegram.sendVideo(telegramId, { source: videoPath });
    }
  });
}
