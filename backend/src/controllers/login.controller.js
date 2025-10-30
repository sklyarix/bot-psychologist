import { isValid, parse } from "@telegram-apps/init-data-node";
import { env } from "../../config/env.js";
import { generateToken } from "../helpers/generateToken.js";
import { prisma } from "../lib/prisma.js";

//import { addPersonalJob } from "../queue.js";

// @desc Обновить и создать пользователя
// @route post /api/login
// @access Public
export const login = async (req, res) => {
  try {
    const { initData } = req.body;
    if (!initData) {
      return res.status(400).json({ error: "AUTH__MISSING_INITDATA" });
    }

    if (!env.TELEGRAM_BOT_TOKEN) {
      return res.status(400).send({ error: "invalid token" });
    }

    // Валидируем initData с помощью токена бота
    const isInitDataValid = isValid(initData, env.TELEGRAM_BOT_TOKEN);
    // Ошибка, если initData некорректна
    if (!isInitDataValid) {
      return res.status(400).send({ error: "AUTH__INVALID_INITDATA" });
    }
    // Парсим initData и достаем Telegram ID пользователя
    const user = parse(initData).user;
    // Ошибка, tgId
    if (!user) {
      return res.status(400).send({ error: "AUTH__INVALID_INITDATA" });
    }
    const currentDate = new Date();
    const userData = await prisma.user.upsert({
      where: {
        telegramId: user.id.toString(),
      },
      update: {
        updatedAt: currentDate,
        username: user.username ?? "",
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        photoUrl: user.photo_url ?? "",
        language: user.language_code ?? "",
        isPremium: user.is_premium,
      },
      create: {
        telegramId: user.id.toString(),
        username: user.username ?? "",
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        photoUrl: user.photo_url ?? "",
        language: user.language_code,
        isPremium: user.is_premium,
      },
    });

    const token = generateToken(userData.id);
    return res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.log("Ошибка /api/login =", error);
    return res.status(500).json({ error: "internal_error" });
  }
};
