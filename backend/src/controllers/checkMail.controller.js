import { prisma } from '../lib/prisma.js'

// @desc Проверка существования пользователя
// @route post /api/auth/check-email
// @access Public
export const userCheck = async (req, res) => {
	try {
		const { email } = req.body

		if (!email) {
			return res.status(400).json({ error: 'email is required' })
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		})

		return res.json({
			exists: !!user
		})
	} catch (error) {
		console.error('Ошибка /api/auth/check-email =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
