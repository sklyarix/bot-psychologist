import { prisma } from '../../lib/prisma.js'

//TODO: access должен быть Private
// @desc Записывает посещение
// @route POST /api/stats/visit
// @access Public
export const createVisit = async (req, res) => {
	try {
		const { userId } = req.user

		const visit = await prisma.webVisit.create({
			data: {
				userId: userId || null
			}
		})

		return res.status(201).json({ success: true, visit })
	} catch (e) {
		console.error('createVisit error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

//TODO: access должен быть Private
// @desc Получить все посещения
// @route GET /api/stats/visit
// @access Public
export const getAllVisits = async (req, res) => {
	try {
		const visits = await prisma.webVisit.findMany({
			orderBy: {
				visitedAt: 'desc'
			}
		})

		return res.status(200).json({ success: true, visits })
	} catch (e) {
		console.error('getAllVisits error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}
