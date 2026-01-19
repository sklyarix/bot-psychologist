import { prisma } from '../lib/prisma.js'

// POST /api/stats/visit
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

// GET /api/stats/visit
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
