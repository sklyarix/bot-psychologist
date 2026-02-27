import { prisma } from '../lib/prisma.js'

// @desc Получить всех пользователей
// @route GET /api/users
// @access Public (можно добавить auth при необходимости)
export const getAllUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany({
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
				lastActive: true,
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
