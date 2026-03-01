import { prisma } from '../lib/prisma.js'

// @desc Получить пользователей за все время
// @route GET /api/users
// @route GET /api/users?isSubBot=true
// @route GET /api/users?isSubBot=false
// @access Public (можно добавить auth при необходимости)
export const getAllUsers = async (req, res) => {
	try {
		const { isSubBot } = req.query

		const where = {}
		if (isSubBot !== undefined) {
			where.isSubBot = isSubBot === 'true'
		}

		const users = await prisma.user.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				telegramId: true,
				username: true,
				firstName: true,
				lastName: true,
				photoUrl: true,
				language: true,
				isPremium: true,
				createdAt: true,
				updatedAt: true
			}
		})

		return res.json({ success: true, users })
	} catch (error) {
		console.error('Ошибка /api/users =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}

// @desc Получить подписанных пользователей
// @route GET /api/users
// @access Public (можно добавить auth при необходимости)
