import { splitPlanByDays } from "../helpers/splitPlanByDays.js";
import { prisma } from "../lib/prisma.js";
import { AI_GOAL_QUEUE, BOT_MESSAGE_QUEUE, getBoss } from "../queues/index.js";
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

      console.log("[ai-goal worker] resultAi:", resultAi);

      const objectDays = splitPlanByDays(resultAi);
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
      for (let i = 2; i <= diffDays; i++) {
        /*
        const target = new Date(now);
        target.setDate(target.getDate() + i);
         */
        const message =
          i < 7
            ? `Открылся доступ по вашей цели за ${i} день`
            : `А вот финальный день по вашей цели и у меня для вас есть предложение.`;
        await boss.send(
          BOT_MESSAGE_QUEUE,
          { telegramId, message },
          {
            startAfter: new Date(now.getTime() + (i - 1) * 24 * 60 * 60 * 1000),
            retryLimit: 3,
            retryDelay: 60,
          },
        );
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
