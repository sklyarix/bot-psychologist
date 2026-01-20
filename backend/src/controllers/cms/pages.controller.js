import { prisma } from '../../lib/prisma.js'

// POST /api/cms/pages
export const createPage = async (req, res) => {
	try {
		const { title, slug } = req.body

		const page = await prisma.page.create({
			data: {
				title,
				slug
			}
		})

		return res.status(201).json({ success: true, page })
	} catch (e) {
		console.error('createPage error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// GET /api/cms/pages
export const getAllPages = async (req, res) => {
	try {
		const pages = await prisma.page.findMany()

		return res.status(200).json(pages)
	} catch (e) {
		console.error('getAllPages error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// GET /api/cms/pages:id
export const getIdPage = async (req, res) => {
	try {
		const { id } = req.params

		const page = await prisma.page.findUnique({
			where: { id },
			include: {
				fields: {
					orderBy: { displayOrder: 'asc' }
				},
				pageFieldGroups: true
			}
		})

		if (!page) {
			return res.status(404).json({ success: false, error: 'not_found' })
		}

		return res.status(200).json(page)
	} catch (e) {
		console.error('getIdPage error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// PUT /api/cms/pages/:id
export const updatePage = async (req, res) => {
	try {
		const { id } = req.params
		const { title, slug } = req.body

		const page = await prisma.page.update({
			where: { id },
			data: {
				title,
				slug
			}
		})

		return res.status(200).json({ success: true, page })
	} catch (e) {
		console.error('updatePage error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

// DELETE /api/cms/pages/:id
export const deletePage = async (req, res) => {
	try {
		const { id } = req.params

		await prisma.page.delete({
			where: { id }
		})

		return res.status(200).json({ success: true })
	} catch (e) {
		console.error('deletePage error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}
