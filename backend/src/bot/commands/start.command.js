import { Markup } from "telegraf";
import { env } from "../../../config/env.js";

export async function startCommand(ctx) {
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.webApp("Войти в кабинет", env.WEB_APP),

      //Markup.button.url('Войти в кабинет url', 'https://t.me/devpsychologist_bot?startapp'),
      Markup.button.url(
        "Записаться на консультацию",
        "http://ivannasapcho2.tilda.ws/1",
      ),
    ],
  ]);

  await ctx.replyWithHTML(
    "Давай познакомимся\n\nПравила\n\nВозможности",
    keyboard,
  );
}
