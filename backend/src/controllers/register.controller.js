import bcrypt from 'bcrypt'
import { generateToken } from '../helpers/generateToken.js'
import { prisma } from '../lib/prisma.js'

// @desc Создать пользователя
// @route post /api/auth/register
// @access Public
export const register = async (req, res) => {
	try {
		const { email, password } = req.body
		// Валидация
		if (!email || !password) {
			return res.status(400).json({ error: 'email and password are required' })
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: 'password must be at least 6 characters' })
		}

		// Проверить, существует ли пользователь с таким email
		const existingUser = await prisma.user.findUnique({
			where: { email }
		})

		if (existingUser) {
			return res.status(409).json({ error: 'user_already_exists' })
		}

		// Захешировать пароль
		const hashedPassword = await bcrypt.hash(password, 10)

		// Создать пользователя
		const userData = await prisma.user.create({
			data: {
				email,
				password: hashedPassword
			}
		})

		// Создать токен
		const token = generateToken(userData.id)

		return res.json({
			user: {
				id: userData.id,
				email: userData.email
			},
			token
		})
	} catch (error) {
		console.error('Ошибка /api/auth/register =', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}
