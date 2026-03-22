import { prisma } from '../lib/prisma.js'

// Get all AI goal messages
export const getAllAiGoalMessages = async (req, res) => {
	try {
		const messages = await prisma.aiGoalMessage.findMany({
			orderBy: { day: 'asc' }
		})
		res.json(messages)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Get AI goal message by ID
export const getAiGoalMessageById = async (req, res) => {
	try {
		const { id } = req.params
		const message = await prisma.aiGoalMessage.findUnique({
			where: { id }
		})
		if (!message) {
			return res.status(404).json({ error: 'AI goal message not found' })
		}
		res.json(message)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Create new AI goal message
export const createAiGoalMessage = async (req, res) => {
	try {
		const { day, message } = req.body
		const aiGoalMessage = await prisma.aiGoalMessage.create({
			data: { day, message }
		})
		res.status(201).json(aiGoalMessage)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Update AI goal message by ID
export const updateAiGoalMessage = async (req, res) => {
	try {
		const { id } = req.params
		const { day, message } = req.body
		const aiGoalMessage = await prisma.aiGoalMessage.update({
			where: { id },
			data: { day, message }
		})
		res.json(aiGoalMessage)
	} catch (error) {
		if (error.code === 'P2025') {
			return res.status(404).json({ error: 'AI goal message not found' })
		}
		res.status(500).json({ error: error.message })
	}
}

// Delete AI goal message by ID
export const deleteAiGoalMessage = async (req, res) => {
	try {
		const { id } = req.params
		await prisma.aiGoalMessage.delete({
			where: { id }
		})
		res.status(204).send()
	} catch (error) {
		if (error.code === 'P2025') {
			return res.status(404).json({ error: 'AI goal message not found' })
		}
		res.status(500).json({ error: error.message })
	}
}
