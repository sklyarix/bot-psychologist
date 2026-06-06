import bcrypt from 'bcrypt'
import { generateToken } from '../helpers/generateToken.js'
import { prisma } from '../lib/prisma.js'

// @desc Аутентифицировать пользователя
// @route post /api/auth/login
// @access Public
export const login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Валидация
		if (!email || !password) {
			return res.status(400).json({ error: 'email and password are required' })
		}

		// Найти пользователя по email
		const user = await prisma.user.findUnique({
			where: { email }
		})

		if (!user) {
			return res.status(401).json({ error: 'invalid_credentials' })
		}

		// Проверить пароль
		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'invalid_credentials' })
		}

		// Обновить время последней активности (если нужно)
		await prisma.user.update({
			where: { id: user.id },
			data: { updatedAt: new Date() }
		})

		// Создать токен
		const token = generateToken(user.id)

		return res.json({
			user: {
				id: user.id,
				email: user.email
			},
			token
		})
	} catch (error) {
		console.error('Ошибка /api/auth/login =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
