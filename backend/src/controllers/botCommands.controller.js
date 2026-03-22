import { prisma } from '../lib/prisma.js'

// Get all bot commands
export const getAllBotCommands = async (req, res) => {
	try {
		const botCommands = await prisma.botCommand.findMany()
		res.json(botCommands)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Create new bot command
export const createBotCommand = async (req, res) => {
	try {
		const { command, content } = req.body
		const botCommand = await prisma.botCommand.create({
			data: { command, content }
		})
		res.status(201).json(botCommand)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// Update bot command by ID
export const updateBotCommand = async (req, res) => {
	try {
		const { id } = req.params
		const { command, content } = req.body
		const botCommand = await prisma.botCommand.update({
			where: { id },
			data: { command, content }
		})
		res.json(botCommand)
	} catch (error) {
		if (error.code === 'P2025') {
			return res.status(404).json({ error: 'Bot command not found' })
		}
		res.status(500).json({ error: error.message })
	}
}

// Delete bot command by ID
export const deleteBotCommand = async (req, res) => {
	try {
		const { id } = req.params
		await prisma.botCommand.delete({
			where: { id }
		})
		res.status(204).send()
	} catch (error) {
		if (error.code === 'P2025') {
			return res.status(404).json({ error: 'Bot command not found' })
		}
		res.status(500).json({ error: error.message })
	}
}

// Get bot command by ID
export const getBotCommandById = async (req, res) => {
	try {
		const { id } = req.params
		const botCommand = await prisma.botCommand.findUnique({
			where: { id }
		})
		if (!botCommand) {
			return res.status(404).json({ error: 'Bot command not found' })
		}
		res.json(botCommand)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
