import { prisma } from '../../lib/prisma.js'

// POST /api/cms/page-fields
export const createPageField = async (req, res) => {
	try {
		const { pageId, title, pageGroupId, name, html, displayOrder } = req.body

		const pageField = await prisma.pageField.create({
			data: {
				pageId,
				pageGroupId,
				name,
				title,
				html,
				displayOrder
			}
		})

		return res.status(201).json({ success: true, pageField })
	} catch (e) {
		console.error('createPageField error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// GET /api/cms/page-fields
export const getAllPageFields = async (req, res) => {
	try {
		const pageFields = await prisma.pageField.findMany()

		return res.status(200).json({ success: true, pageFields })
	} catch (e) {
		console.error('getAllPageFields error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// GET /api/cms/page-fields/:id
export const getIdPageField = async (req, res) => {
	try {
		const { id } = req.params

		const pageField = await prisma.pageField.findUnique({
			where: { id }
		})

		if (!pageField) {
			return res.status(404).json({ success: false, error: 'not_found' })
		}

		return res.status(200).json({ success: true, pageField })
	} catch (e) {
		console.error('getIdPageField error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}
// PUT /api/cms/page-fields/:id
export const updatePageField = async (req, res) => {
	try {
		const { id } = req.params
		const { pageId, pageGroupId, name, title, html, displayOrder } = req.body

		const pageField = await prisma.pageField.update({
			where: { id },
			data: {
				pageId,
				pageGroupId,
				title,
				name,
				html,
				displayOrder
			}
		})

		return res.status(200).json({ success: true, pageField })
	} catch (e) {
		console.error('updatePageField error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// DELETE /api/cms/page-fields/:id
export const deletePageField = async (req, res) => {
	try {
		const { id } = req.params

		await prisma.pageField.delete({
			where: { id }
		})

		return res.status(200).json({ success: true })
	} catch (e) {
		console.error('deletePageField error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}
