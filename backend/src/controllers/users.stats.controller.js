import { prisma } from '../lib/prisma.js'

// @desc Получить подробную статистику по пользователю
// @route GET /api/users/:id/stats
// @access Public (add auth if needed)
export const getUserStats = async (req, res) => {
	try {
		const { id } = req.params
		if (!id) return res.status(400).json({ error: 'user id required' })

		// AiGoals для пользователя
		const aiGoals = await prisma.aiGoal.findMany({
			where: { userId: id },
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				title: true,
				status: true,
				createdAt: true,
				finishedAt: true
			}
		})

		// AiQuestionAnswer для пользователя
		const aiQAs = await prisma.aiQuestionAnswer.findMany({
			where: { userId: id },
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				question: true,
				answer: true,
				status: true,
				createdAt: true
			}
		})

		// Визиты пользователя за последние 30 дней (по дням)
		const now = new Date()
		const start = new Date(now)
		start.setHours(0, 0, 0, 0)
		start.setDate(start.getDate() - 29)

		const visits = await prisma.webVisit.findMany({
			where: {
				userId: id,
				visitedAt: { gte: start }
			},
			select: { visitedAt: true }
		})

		// Сгруппируем по дате ISO yyyy-mm-dd
		const countsMap = {}
		for (const v of visits) {
			const d = new Date(v.visitedAt)
			const key = d.toISOString().slice(0, 10)
			countsMap[key] = (countsMap[key] || 0) + 1
		}

		// Построим массив дат и соответствующих количеств за последние 30 дней
		const visitsDates = []
		const visitsCounts = []
		for (let i = 0; i < 30; i++) {
			const d = new Date(start)
			d.setDate(start.getDate() + i)
			const key = d.toISOString().slice(0, 10)
			visitsDates.push(key)
			visitsCounts.push(countsMap[key] || 0)
		}

		const totalVisitsLast30 = visitsCounts.reduce((s, n) => s + n, 0)

		return res.json({
			success: true,
			aiGoals,
			aiQAs,
			visitsPerDay: visitsCounts,
			visitsDates,
			totalVisitsLast30
		})
	} catch (error) {
		console.error('getUserStats error =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
