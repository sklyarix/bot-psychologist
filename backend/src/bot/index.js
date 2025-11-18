import { Telegraf } from "telegraf";
import { env } from "../../config/env.js";
import { helpCommand } from "./commands/help.command.js";
import { infoCommand } from "./commands/info.command.js";
import { startCommand } from "./commands/start.command.js";

const token = `${env.TELEGRAM_BOT_TOKEN}/test`;
let bot = null;

export function initBot() {
  bot = new Telegraf(token);
  bot.start((ctx) => startCommand(ctx));
  bot.command("help", (ctx) => helpCommand(ctx));
  bot.command("info", (ctx) => infoCommand(ctx));

  bot.launch().then(() => console.log("Bot launched (polling)"));

  return bot;
}
export function getBot() {
  if (!bot) throw new Error("Bot is not initialized. Call initBot() first.");
  return bot;
}
/*
  const randomAlphaNumericString = "1asfasg";
  bot.launch({
    domain: env.HOST,
    port: env.PORT,
    secretToken: randomAlphaNumericString,
  });
  */

//https://api.telegram.org/bot<token>/test/METHOD_NAME
//http://127.0.0.1:5173
