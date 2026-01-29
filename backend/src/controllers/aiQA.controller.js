import { prisma } from '../lib/prisma.js'
import { AI_QA_QUEUE, getBoss } from '../queues/index.js'

// @desc создаем вопрос-ответ по ИИ
// @route post /api/ai/qa
// @access Private
export const createAiQA = async (req, res) => {
	try {
		const { id: userId } = req.user
		const { question } = req.body

		if (!question) {
			console.error('title are required')
			return res.status(400).json({ error: 'title are required' })
		}

		// 1) создаём QA
		const qa = await prisma.aiQuestionAnswer.create({
			data: {
				userId,
				question,
				status: 'queued'
			}
		})

		// 2) публикуем задание в очередь
		const boss = await getBoss()
		const jobIdBoss = await boss.send(AI_QA_QUEUE, {
			qaId: qa.id,
			question
		})

		return res.status(201).json({
			qa,
			jobIdBoss
		})
	} catch (error) {
		console.error('createAiQA error:', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}

// @desc Получить все вопрос-ответ у пользователя
// @route get /api/ai/qa
// @access Private
export const getAllAiQA = async (req, res) => {
	try {
		const { id: userId } = req.user

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		if (!user) {
			return res.status(401).json({ error: 'user_not_found' })
		}

		const result = await prisma.aiQuestionAnswer.findMany({
			where: {
				userId
			},
			orderBy: { createdAt: 'desc' }
		})

		return res.status(200).json(result)
	} catch (error) {
		console.error('getAllAiQA error:', error)
		return res.status(500).json({ error: 'internal_error' })
	}
}

// @desc Получить цель пользователя по id
// @route get /api/ai/qa/:id
// @access Private
export const getIdAiQA = async (req, res) => {
	const { id } = req.params
	const { id: userId } = req.user

	const result = await prisma.aiQuestionAnswer.findUnique({
		where: {
			id,
			userId
		}
	})

	return res.status(200).json(result)
}
