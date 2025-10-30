import { prisma } from "../lib/prisma.js";
import { AI_QA_QUEUE, getBoss } from "../queues/index.js";
import { AIService } from "../services/ai.service.js";

const ai = new AIService();

export async function aiQuestionAnswerWorker() {
  const boss = await getBoss();

  await boss.work(AI_QA_QUEUE, { teamSize: 1 }, async ([job]) => {
    const { qaId, question } = job.data;

    // Обновили статусы
    await prisma.aiQuestionAnswer.update({
      where: { id: qaId },
      data: { status: "active" },
    });

    try {
      const resultAi = await ai.sendTimewebGPT({
        presetKey: "questionAnswer",
        text: question,
      });

      await prisma.aiQuestionAnswer.update({
        where: { id: qaId },
        data: {
          answer: resultAi,
          status: "completed",
        },
      });
    } catch (error) {
      console.error("aiQuestionAnswer error:", error);
      await prisma.aiQuestionAnswer.update({
        where: { id: qaId },
        data: { status: "failed" },
      });
    }
  });
}
