import { splitPlanByDays } from "../helpers/splitPlanByDays.js";
import { prisma } from "../lib/prisma.js";
import {
  AI_GOAL_QUEUE,
  BOT_MESSAGE_QUEUE,
  BOT_MESSAGE_VIDEO_QUEUE,
  getBoss,
} from "../queues/index.js";
import { AIService } from "../services/ai.service.js";

const ai = new AIService();

export async function aiGoalWorker() {
  const boss = await getBoss();
  await boss.work(AI_GOAL_QUEUE, { teamSize: 1 }, async ([job]) => {
    console.log("[ai-goal worker] got job:", job.id, job.data);

    const { goalId, telegramId, title } = job.data;

    // Обновили статусы
    await prisma.$transaction(async (tx) => {
      await tx.aiGoal.update({
        where: { id: goalId },
        data: { status: "active" },
      });
    });

    // Даты для целей
    const now = new Date();
    const finishedAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    try {
      const resultAi = await ai.sendTimewebGPT({
        presetKey: "goal",
        text: title,
      });

      // ПРОВЕРКА: ответ от timeweb
      if (!resultAi) {
        // Обновляем данные и статусы
        return prisma.$transaction(async (tx) => {
          await tx.aiGoal.update({
            where: { id: goalId },
            data: {
              description: "Технические неполадки. Скоро исправим.",
              status: "completed",
              finishedAt,
            },
          });
        });
      }

      console.log("[ai-goal worker] resultAi:", resultAi);

      const objectDays = splitPlanByDays(resultAi);
      console.log("[ai-goal worker] objectDays:", objectDays);

      // ПРОВЕРКА: корректный ли запрос пользователя
      if (objectDays.length === 0) {
        // Обновляем данные и статусы
        return prisma.$transaction(async (tx) => {
          await tx.aiGoal.update({
            where: { id: goalId },
            data: {
              description: "Так не сработает. Напишите корректную цель",
              status: "completed",
              finishedAt,
            },
          });
        });
      }
      // Обновляем данные и статусы
      await prisma.$transaction(async (tx) => {
        await tx.aiGoal.update({
          where: { id: goalId },
          data: {
            description: objectDays,
            status: "completed",
            finishedAt,
          },
        });
      });

      // Ставим уведомления
      const diffDays = Math.round((finishedAt - now) / (1000 * 60 * 60 * 24));
      for (let i = 1; i <= diffDays; i++) {
        /*
        const target = new Date(now);
        target.setDate(target.getDate() + i);
         */
        let message;
        switch (i) {
          case 1:
            message = `Твой первый шаг открыт.\nСкорее действуй!`;
            break;
          case 2:
            message = `Следующий шаг уже ждёт тебя.\nЧто из вчерашнего вызвало сопротивление? Обрати на это внимание.`;
            break;
          case 3:
            message = `Третий шаг открыт. открыт.\nЧто теперь замечаешь в себе, чего раньше не получалось видеть?`;
            break;
          case 4:
            message = `Можно двигаться дальше, но сначала подумай, что сейчас поддерживает тебя больше всего — и как ты это используешь?`;
            break;
          case 5:
            message = `Следующий шаг доступен.\nКакое небольшое, но важное изменение ты уже чувствуешь?`;
            break;
          case 6:
            message = `Ты близко к финалу и началу нового пути.\nЧто стало для тебя яснее за эти дни?`;
            break;
          case 7:
            message = `Финальный шаг открыт.\nИ помни, что это только начало!`;
            break;
        }

        await boss.send(
          BOT_MESSAGE_QUEUE,
          { telegramId, message },
          {
            startAfter: new Date(
              now.getTime() + 60 * 1000 + (i - 1) * 24 * 60 * 60 * 1000,
            ),
            retryLimit: 3,
            retryDelay: 60,
          },
        );

        if (i === diffDays) {
          await boss.send(
            BOT_MESSAGE_VIDEO_QUEUE,
            { telegramId },
            {
              startAfter: new Date(now.getTime() + 60 * 1000),
              retryLimit: 3,
              retryDelay: 60,
            },
          );
        }
      }
    } catch (e) {
      console.error("aiGoalWorker error:", e);
      await prisma.aiGoal.update({
        where: { id: goalId },
        data: { status: "failed" },
      });
    }
  });
}
