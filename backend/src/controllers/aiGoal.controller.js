import { prisma } from "../lib/prisma.js";
import { AI_GOAL_QUEUE, getBoss } from "../queues/index.js";

// @desc создаем цель по ИИ
// @route post /api/ai/goals
// @access Private
export const createAiGoal = async (req, res) => {
  try {
    const { id: userId, telegramId } = req.user;
    const { title } = req.body;

    if (!title) {
      console.log("title are required");
      return res.status(400).json({ error: "title are required" });
    }

    // 1) создаём цель
    const goal = await prisma.aiGoal.create({
      data: {
        userId,
        title,
        status: "queued",
      },
    });

    // 2) публикуем задание в очередь
    const boss = await getBoss();
    const jobIdBoss = await boss.send(AI_GOAL_QUEUE, {
      goalId: goal.id,
      telegramId,
      title,
    });

    console.log("[publish] ai-goal bossJobId:", jobIdBoss);

    return res.status(201).json({
      goal,
      jobIdBoss,
    });
  } catch (error) {
    console.error("aiPersonal error:", error);
    return res.status(500).json({ error: "internal_error" });
  }
};

// @desc Получить все цели у пользователя
// @route get /api/ai/goals
// @access Private
export const getAllAiGoal = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "user_not_found" });
    }

    const result = await prisma.aiGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(result);
  } catch (error) {}
};

// @desc Получить цель пользователя по id
// @route get /api/ai/goals/:id
// @access Private
export const getIdAiGoal = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const result = await prisma.aiGoal.findUnique({
    where: {
      id,
      userId,
    },
  });

  return res.status(200).json(result);
};
